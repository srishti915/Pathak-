import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ContactLead {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
  recipientEmail: string;
  read?: boolean;
}

const leadsFilePath = path.resolve(__dirname, 'leads_data.json');
const publicDir = path.resolve(__dirname, 'public');
const assetsImgDir = path.resolve(__dirname, 'src/assets/images');
const photoConfigPath = path.resolve(__dirname, 'photo_config.json');
const siteConfigFilePath = path.resolve(__dirname, 'site_config.json');

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(assetsImgDir)) {
  fs.mkdirSync(assetsImgDir, { recursive: true });
}
const uploadsDir = path.resolve(publicDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function loadLeads(): ContactLead[] {
  try {
    if (fs.existsSync(leadsFilePath)) {
      const data = fs.readFileSync(leadsFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads file:', err);
  }
  return [];
}

function saveLeadsList(leads: ContactLead[]): void {
  try {
    fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing leads list:', err);
  }
}

function saveLead(lead: ContactLead): void {
  const leads = loadLeads();
  leads.push(lead);
  saveLeadsList(leads);
}

function loadSiteConfig(): any {
  try {
    if (fs.existsSync(siteConfigFilePath)) {
      const data = fs.readFileSync(siteConfigFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading site config file:', err);
  }
  return null;
}

function saveSiteConfig(config: any): void {
  try {
    fs.writeFileSync(siteConfigFilePath, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing site config file:', err);
  }
}

// Admin Credentials requested by User
const ADMIN_ID = 'srishtidigital36@gmail.com';
const ADMIN_PASSWORD = 'srishti1234';

// Active Session Tokens
const activeSessions = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support JSON and urlencoded payloads up to 30mb
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Static serving for public assets
  app.use(express.static(publicDir));

  // Public endpoint: Get site configuration (colors, text, images, background)
  app.get('/api/site-config', (req, res) => {
    try {
      const config = loadSiteConfig();
      if (config) {
        return res.json({ success: true, config });
      }
      return res.status(404).json({ success: false, error: 'Config not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to read site config' });
    }
  });

  // Public endpoint: Check profile photo
  app.get('/api/profile-photo', (req, res) => {
    try {
      const webpPath = path.resolve(publicDir, 'srishti_pathak.webp');
      const pngPath = path.resolve(publicDir, 'srishti_pathak.png');
      const jpgPath = path.resolve(publicDir, 'srishti_pathak.jpg');

      if (fs.existsSync(webpPath)) {
        return res.json({ hasPhoto: true, photoUrl: '/srishti_pathak.webp', format: 'webp' });
      } else if (fs.existsSync(pngPath)) {
        return res.json({ hasPhoto: true, photoUrl: '/srishti_pathak.png', format: 'png' });
      } else if (fs.existsSync(jpgPath)) {
        return res.json({ hasPhoto: true, photoUrl: '/srishti_pathak.jpg', format: 'jpg' });
      }

      if (fs.existsSync(photoConfigPath)) {
        const config = JSON.parse(fs.readFileSync(photoConfigPath, 'utf-8'));
        if (config.photoData) {
          return res.json({ hasPhoto: true, photoUrl: config.photoData });
        }
      }

      return res.json({ hasPhoto: false, photoUrl: null });
    } catch (err) {
      console.error('Error getting profile photo:', err);
      return res.status(500).json({ error: 'Failed to check profile photo' });
    }
  });

  // Admin Authentication Middleware
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeSessions.has(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session' });
    }
    next();
  };

  // ADMIN ENDPOINTS
  // 1. Admin Login
  app.post('/api/admin/login', (req, res) => {
    try {
      const { id, password } = req.body || {};

      if (!id || !password) {
        return res.status(400).json({ success: false, error: 'Both ID and password are required.' });
      }

      const trimmedId = String(id).trim().toLowerCase();
      const trimmedPassword = String(password).trim();

      if (trimmedId === ADMIN_ID.toLowerCase() && trimmedPassword === ADMIN_PASSWORD) {
        const token = `srishti_adm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        activeSessions.add(token);

        console.log(`[ADMIN LOGIN SUCCESS] User: ${ADMIN_ID} logged in at ${new Date().toISOString()}`);

        return res.json({
          success: true,
          token,
          admin: {
            id: ADMIN_ID,
            name: 'Srishti Pathak',
            role: 'Administrator',
          },
        });
      } else {
        return res.status(401).json({ success: false, error: 'Invalid ID or Password. Please try again.' });
      }
    } catch (err) {
      console.error('Admin login error:', err);
      return res.status(500).json({ success: false, error: 'Server error during login.' });
    }
  });

  // 2. Admin Check Token
  app.get('/api/admin/check', requireAdminAuth, (req, res) => {
    res.json({
      success: true,
      authenticated: true,
      admin: {
        id: ADMIN_ID,
        name: 'Srishti Pathak',
      },
    });
  });

  // 3. Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeSessions.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // 4. Admin Get Leads
  app.get('/api/admin/leads', requireAdminAuth, (req, res) => {
    try {
      const leads = loadLeads().sort(
        (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
      res.json({ success: true, leads });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch leads.' });
    }
  });

  // 5. Admin Toggle Lead Read Status
  app.patch('/api/admin/leads/:id/read', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const leads = loadLeads();
      const lead = leads.find((l) => l.id === id);
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found.' });
      }
      lead.read = req.body.read !== undefined ? Boolean(req.body.read) : !lead.read;
      saveLeadsList(leads);
      res.json({ success: true, lead });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to update lead.' });
    }
  });

  // 6. Admin Delete Lead
  app.delete('/api/admin/leads/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const leads = loadLeads();
      const updated = leads.filter((l) => l.id !== id);
      saveLeadsList(updated);
      res.json({ success: true, message: 'Lead deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to delete lead.' });
    }
  });

  // 7. Admin Stats
  app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
    try {
      const leads = loadLeads();
      const unread = leads.filter((l) => !l.read).length;
      res.json({
        success: true,
        totalLeads: leads.length,
        unreadLeads: unread,
        lastLeadDate: leads.length > 0 ? leads[leads.length - 1].receivedAt : null,
        adminEmail: ADMIN_ID,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to load stats.' });
    }
  });

  // 8. Admin Update Site Configuration (Color, Text, Images, Background)
  app.put('/api/admin/site-config', requireAdminAuth, (req, res) => {
    try {
      const newConfig = req.body?.config;
      if (!newConfig || typeof newConfig !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid configuration payload.' });
      }

      saveSiteConfig(newConfig);
      console.log(`[SITE CONFIG UPDATED BY ADMIN] at ${new Date().toISOString()}`);

      return res.json({
        success: true,
        message: 'Website configuration updated successfully!',
        config: newConfig,
      });
    } catch (err) {
      console.error('Error updating site config:', err);
      return res.status(500).json({ success: false, error: 'Failed to save site configuration.' });
    }
  });

  // 9. Admin Upload Any Image (for Profile, Guitar, Art, Craft, Background, etc.)
  app.post('/api/admin/upload-image', requireAdminAuth, (req, res) => {
    try {
      const { imageBase64, imageName, category } = req.body || {};

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ success: false, error: 'No image data provided.' });
      }

      let base64Data = imageBase64;
      let ext = 'jpg';
      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        const mime = parts[0];
        base64Data = parts[1];
        if (mime.includes('png')) ext = 'png';
        else if (mime.includes('webp')) ext = 'webp';
        else if (mime.includes('svg')) ext = 'svg';
        else ext = 'jpg';
      }

      const buffer = Buffer.from(base64Data, 'base64');
      const safePrefix = category ? String(category).replace(/[^a-zA-Z0-9_-]/g, '') : 'img';
      const fileName = `${safePrefix}_${Date.now()}.${ext}`;
      const filePath = path.resolve(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${fileName}`;

      console.log(`[ADMIN IMAGE UPLOADED] Saved ${fileName} (${buffer.length} bytes) to ${filePath}`);

      return res.json({
        success: true,
        url: publicUrl,
        fileName,
        message: 'Image uploaded successfully.',
      });
    } catch (err) {
      console.error('Error uploading image in admin:', err);
      return res.status(500).json({ success: false, error: 'Failed to save uploaded image.' });
    }
  });

  // 10. Admin Reset Site Configuration to Defaults
  app.post('/api/admin/reset-site-config', requireAdminAuth, (req, res) => {
    try {
      const defaultConfig = {
        theme: {
          primaryColor: '#6b21a8',
          secondaryColor: '#2563eb',
          accentColor: '#facc15',
          backgroundColor: '#ffffff',
        },
        hero: {
          introKicker: "HELLO, I'M",
          name: 'Srishti Pathak',
          headline: 'B.Com Honours Student | Digital Marketing Learner | AI Automation Enthusiast',
          bio: "I'm currently pursuing B.Com Honours while learning Digital Marketing and AI Automation. I love exploring technology, creativity, and new ideas while building skills for my future career.",
          photoUrl: '/srishti_pathak.webp',
          ctaSkillsText: 'Explore My Skills',
          ctaConnectText: "Let's Connect",
        },
        about: {
          heading: 'About Me',
          subtitle: 'A little more about my journey, interests and goals',
          greeting: "Hi, I'm Srishti Pathak.",
          block1: 'I am currently pursuing B.Com Honours and exploring the world of Digital Marketing and AI Automation.',
          block2: 'I am interested in learning how digital platforms, marketing strategies and AI tools can be combined to create useful and creative solutions.',
          block3: 'Along with technology and marketing, I also enjoy creative activities such as playing guitar, art and craft.',
          block4: 'My current goal is to continuously improve my skills, gain practical experience and build a strong foundation for my future career in the digital world.',
          quickIntro: {
            name: 'Srishti Pathak',
            education: 'B.Com Honours — Currently Pursuing',
            class12: '79%',
            class10: '84%',
            learning: 'Digital Marketing & AI Automation',
            interests: 'Guitar • Art • Craft',
          },
        },
        skills: {
          heading: 'My Skills',
          subtitle: "Skills I'm learning, developing and exploring",
          intro: "I'm currently building my skills in Digital Marketing, AI, automation, content creation and creative technology. I'm focused on learning through practice and continuously improving my abilities.",
          featuredTitle: 'Digital Marketing + AI Automation',
          featuredDesc: 'My current focus is understanding how digital marketing and AI automation can work together to create smarter, more efficient digital workflows.',
        },
        education: {
          heading: 'My Education',
          subtitle: 'My academic journey and learning foundation',
          bcomTitle: 'B.Com Honours',
          bcomStatus: 'Currently Pursuing',
          bcomDesc: 'Currently pursuing B.Com Honours and building a foundation in commerce, business and related subjects while developing additional digital skills.',
          class12Title: 'Class 12',
          class12Score: '79%',
          class12Desc: 'Successfully completed Class 12 with 79%.',
          class10Title: 'Class 10',
          class10Score: '84%',
          class10Desc: 'Successfully completed Class 10 with 84%.',
          beyondAcademicsText: 'Alongside my formal education, I am developing practical skills in Digital Marketing, AI Automation and creative areas such as Guitar, Art and Craft.',
        },
        hobbies: {
          heading: 'Hobbies & Interests',
          subtitle: 'Creative activities that bring balance, inspiration and mindfulness',
          guitarTitle: 'Guitar',
          guitarDesc: 'Playing acoustic guitar brings a sense of rhythm and mindfulness to my day. Learning chord transitions and melodies nurtures patience, focus, and a creative outlet alongside my studies.',
          guitarImg: '/hobby_guitar_1791262467059.jpg',
          artTitle: 'Art',
          artDesc: 'Exploring watercolor painting and pencil sketching allows me to experiment with colors, textures, and visual compositions. This creative interest helps me develop an intuitive eye for design and aesthetics.',
          artImg: '/hobby_art_1791262480246.jpg',
          craftTitle: 'Craft',
          craftDesc: 'Working on handmade crafts, paper art, and DIY projects sharpens my precision and attention to fine detail. Turning simple materials into thoughtful creations is both relaxing and creatively fulfilling.',
          craftImg: '/hobby_craft_1791262496525.jpg',
        },
        contact: {
          heading: "Let's Connect",
          subtitle: "Have a project, idea, or simply want to get in touch? I'd love to hear from you.",
          email: 'srishtidigital36@gmail.com',
          instagram: 'Srishti.diaries_',
          whatsappText: 'Hi Srishti! I saw your portfolio and would like to connect.',
          ctaHeading: "Let's Work Together",
          ctaDesc: 'Whether you have a project idea, collaboration opportunity, or a question, feel free to send me a message.',
        },
      };

      saveSiteConfig(defaultConfig);
      return res.json({ success: true, config: defaultConfig, message: 'Configuration reset to defaults.' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to reset site config.' });
    }
  });

  // Public Contact form submission endpoint
  app.post('/api/contact', (req, res) => {
    try {
      const { name, email, message } = req.body || {};

      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ success: false, error: 'Full Name is required.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
        return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      }

      if (!message || typeof message !== 'string' || message.trim().length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a message with at least 5 characters.',
        });
      }

      const newLead: ContactLead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        receivedAt: new Date().toISOString(),
        recipientEmail: ADMIN_ID,
        read: false,
      };

      saveLead(newLead);

      console.log('==============================================');
      console.log(`[NEW PORTFOLIO INQUIRY FOR SRISHTI PATHAK]`);
      console.log(`To: ${ADMIN_ID}`);
      console.log(`From: ${newLead.name} <${newLead.email}>`);
      console.log(`Time: ${newLead.receivedAt}`);
      console.log(`Message:\n${newLead.message}`);
      console.log('==============================================');

      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        leadId: newLead.id,
      });
    } catch (error) {
      console.error('Failed to process contact lead:', error);
      return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while sending your message. Please try again or reach out directly.',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Srishti Pathak Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
