import Dockerode, { DockerOptions, Network } from 'dockerode'
import { waitForCondition } from '../../utils'
import { MasterNodeRegTestContainer } from './Masternode'
import { RegTestContainer } from './index'
import { StartOptions } from '../DeFiDContainer'

export class ContainerGroup {
  protected readonly docker: Dockerode
  protected network?: Network

  public constructor (
    protected readonly containers: RegTestContainer[] = [],
    protected readonly name = `testcontainers-${Math.floor(Math.random() * 10000000)}`,
    options?: DockerOptions
  ) {
    this.docker = new Dockerode(options)
  }

  /**
   * @param {number} index of masternode in group
   * @return {MasterNodeRegTestContainer} casted as MN convenience but it might be just a RegTestContainer
   */
  get (index: number): MasterNodeRegTestContainer {
    return this.containers[index] as MasterNodeRegTestContainer
  }

  async start (opts?: StartOptions): Promise<void> {
    this.network = await new Promise((resolve, reject) => {
      return this.docker.createNetwork({
        Name: this.name,
        IPAM: {
          Driver: 'default',
          Config: []
        }
      }, (err, data) => {
        if (err instanceof Error || data === undefined) {
          return reject(err)
        }
        return resolve(data)
      })
    })

    // Removing all predefined containers and adding it to group
    for (const container of this.containers.splice(0)) {
      await container.start(opts)
      await this.add(container)
    }
  }

  async link (): Promise<void> {
    for (const container of this.containers) {
      for (const each of this.containers) {
        await each.addNode(await container.getIp(this.name))
      }
    }
  }

  /**
   * Require network, else error exceptionally.
   * Not a clean design, but it keep the complexity of this implementation low.
   */
  protected requireNetwork (): Network {
    if (this.network !== undefined) {
      return this.network
    }
    throw new Error('network not yet started')
  }

  /**
   * @param {DeFiDContainer} container to add into container group with addnode
   */
  async add (container: RegTestContainer): Promise<void> {
    await this.requireNetwork().connect({ Container: container.id })

    for (const each of this.containers) {
      await container.addNode(await each.getIp(this.name))
    }

    this.containers.push(container)
  }

  /**
   * Wait for all container to receive the same txid in mempool
   *
   * @param {string} txid to wait for in mempool
   * @param {number} [timeout=20000] in millis
   */
  async waitForMempoolSync (txid: string, timeout: number = 20000): Promise<void> {
    await waitForCondition(async () => {
      const txns = await Promise.all(Object.values(this.containers).map(async container => {
        return await container.call('getrawtransaction', [txid, false])
      }))

      return txns.every(value => value === txns[0])
    }, timeout, 200, 'waitForMempoolSync')
  }

  /**
   * Wait for all container to sync up
   * @param {number} [timeout=20000] in millis
   */
  async waitForSync (timeout: number = 20000): Promise<void> {
    await waitForCondition(async () => {
      const hashes = await Promise.all(Object.values(this.containers).map(async container => {
        return await container.getBestBlockHash()
      }))

      return hashes.every(value => value === hashes[0])
    }, timeout, 200, 'waitForSync')
  }

  /**
   * Stop container group and all containers associated with it
   */
  async stop (): Promise<void> {
    for (const container of this.containers) {
      await this.requireNetwork().disconnect({ Container: container.id })
      await container.stop()
    }

    await this.requireNetwork().remove()
    // NOTE: for anyone have RPC timeout issue, esp newer version docker, v3.6.x / v4.x.x
    // enable the following line to ensure docker network pruned correctly between tests
    // global containers prune may cause multithreaded tests clashing each other
    // await this.docker.pruneContainers()
  }
}
