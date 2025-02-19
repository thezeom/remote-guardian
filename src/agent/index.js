
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs').promises;

class NetworkAgent {
  constructor() {
    this.siteId = process.env.SITE_ID || 'default';
    this.lastScan = null;
    this.equipment = new Map();
  }

  async start() {
    console.log('Agent démarré...');
    await this.initializeAgent();
    this.startMonitoring();
  }

  async initializeAgent() {
    try {
      console.log('Initialisation de l\'agent...');
      await this.scanNetwork();
      console.log('Initialisation terminée');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  }

  async scanNetwork() {
    try {
      const interfaces = os.networkInterfaces();
      console.log('Interfaces réseau détectées:', Object.keys(interfaces));

      // Scan basique du réseau avec arp-scan
      exec('arp -a', (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur d'exécution: ${error}`);
          return;
        }
        const devices = stdout.split('\n');
        devices.forEach(device => {
          if (device) {
            console.log('Équipement détecté:', device);
          }
        });
      });
    } catch (error) {
      console.error('Erreur lors du scan réseau:', error);
    }
  }

  startMonitoring() {
    // Scan périodique du réseau
    setInterval(() => this.scanNetwork(), 300000); // Toutes les 5 minutes

    // Surveillance des métriques système
    setInterval(() => this.collectSystemMetrics(), 60000); // Toutes les minutes
  }

  async collectSystemMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      cpuUsage: os.loadavg(),
      memoryUsage: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      uptime: os.uptime(),
    };

    // Log des métriques
    await this.logMetrics(metrics);
  }

  async logMetrics(metrics) {
    try {
      const logFile = `/app/logs/metrics-${new Date().toISOString().split('T')[0]}.log`;
      await fs.appendFile(logFile, JSON.stringify(metrics) + '\n');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des métriques:', error);
    }
  }
}

// Démarrage de l'agent
const agent = new NetworkAgent();
agent.start();

process.on('SIGTERM', () => {
  console.log('Agent arrêté');
  process.exit(0);
});
