const os = require('os');
const { performance } = require('perf_hooks');

class SystemMonitor {
  constructor() {
    this.measurements = [];
    this.intervalId = null;
  }

  getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - (100 * idle / total);

    return {
      usage: usage.toFixed(2),
      cores: cpus.length,
      model: cpus[0].model,
    };
  }

  getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const heapUsed = process.memoryUsage().heapUsed;
    const heapTotal = process.memoryUsage().heapTotal;

    return {
      total: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
      used: (usedMemory / 1024 / 1024 / 1024).toFixed(2),
      free: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
      usage: ((usedMemory / totalMemory) * 100).toFixed(2),
      heapUsed: (heapUsed / 1024 / 1024).toFixed(2),
      heapTotal: (heapTotal / 1024 / 1024).toFixed(2),
    };
  }

  getSystemLoad() {
    const loadavg = os.loadavg();
    return {
      '1min': loadavg[0].toFixed(2),
      '5min': loadavg[1].toFixed(2),
      '15min': loadavg[2].toFixed(2),
    };
  }

  measure() {
    const measurement = {
      timestamp: Date.now(),
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage(),
      load: this.getSystemLoad(),
    };

    this.measurements.push(measurement);
    return measurement;
  }

  start(intervalMs = 1000) {
    if (this.intervalId) {
      console.log('Monitor already running');
      return;
    }

    console.log(`Starting system monitor (interval: ${intervalMs}ms)`);
    this.intervalId = setInterval(() => {
      const measurement = this.measure();
      console.log(`[${new Date().toISOString()}] CPU: ${measurement.cpu.usage}% | Memory: ${measurement.memory.usage}% | Load: ${measurement.load['1min']}`);
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('System monitor stopped');
    }
  }

  getStats() {
    if (this.measurements.length === 0) {
      return null;
    }

    const cpuUsages = this.measurements.map(m => parseFloat(m.cpu.usage));
    const memoryUsages = this.measurements.map(m => parseFloat(m.memory.usage));
    const load1min = this.measurements.map(m => parseFloat(m.load['1min']));

    return {
      duration: (this.measurements[this.measurements.length - 1].timestamp - this.measurements[0].timestamp) / 1000,
      samples: this.measurements.length,
      cpu: {
        avg: (cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length).toFixed(2),
        max: Math.max(...cpuUsages).toFixed(2),
        min: Math.min(...cpuUsages).toFixed(2),
      },
      memory: {
        avg: (memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length).toFixed(2),
        max: Math.max(...memoryUsages).toFixed(2),
        min: Math.min(...memoryUsages).toFixed(2),
      },
      load: {
        avg: (load1min.reduce((a, b) => a + b, 0) / load1min.length).toFixed(2),
        max: Math.max(...load1min).toFixed(2),
        min: Math.min(...load1min).toFixed(2),
      },
    };
  }

  printStats() {
    const stats = this.getStats();
    if (!stats) {
      console.log('No measurements available');
      return;
    }

    console.log('\n=== System Monitor Statistics ===');
    console.log(`Duration: ${stats.duration}s`);
    console.log(`Samples: ${stats.samples}`);
    console.log('\nCPU Usage:');
    console.log(`  Average: ${stats.cpu.avg}%`);
    console.log(`  Max: ${stats.cpu.max}%`);
    console.log(`  Min: ${stats.cpu.min}%`);
    console.log('\nMemory Usage:');
    console.log(`  Average: ${stats.memory.avg}%`);
    console.log(`  Max: ${stats.memory.max}%`);
    console.log(`  Min: ${stats.memory.min}%`);
    console.log('\nSystem Load (1min):');
    console.log(`  Average: ${stats.load.avg}`);
    console.log(`  Max: ${stats.load.max}`);
    console.log(`  Min: ${stats.load.min}`);
    console.log('================================\n');
  }

  reset() {
    this.measurements = [];
  }
}

// CLI usage
if (require.main === module) {
  const monitor = new SystemMonitor();
  const duration = parseInt(process.argv[2]) || 60;
  const interval = parseInt(process.argv[3]) || 1000;

  console.log(`Monitoring for ${duration} seconds with ${interval}ms interval...`);
  monitor.start(interval);

  setTimeout(() => {
    monitor.stop();
    monitor.printStats();
    process.exit(0);
  }, duration * 1000);
}

module.exports = SystemMonitor;
