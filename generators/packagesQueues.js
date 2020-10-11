class PackageQueues {

    constructor() {
        this.packagesQueue = [];
        this.devPackagesQueue = [];
    }

    addToPackagesQueue(name, dev = false) {
        if (dev) {
            this.devPackagesQueue.push(name)
        } else {
            this.packagesQueue.push(name)
        }
    }

}

module.exports = new PackageQueues();