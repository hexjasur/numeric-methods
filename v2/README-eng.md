<p align="center">
  <img src="src/assets/images/logo-glass-optimazed.png" width="130" alt="Sonli Usullar Logo"/>
</p>

<h1 align="center">📊 Sonli Usullar - Numerical Methods</h1>

<p align="center">
  Interactive platform for solving mathematical problems using numerical methods
</p>

<p align="center">
  🌐 <a href="https://sonli-usullar.uz">sonli-usullar.uz</a>
</p>

<p align="center">
  <strong>🌍 Languages | Tillar | Языки</strong><br>
  <a href="README.md">🇺🇿 Uzbek (Oʻzbekcha)</a> • 
  <a href="README-eng.md">🇬🇧 English</a> • 
  <a href="README-ru.md">🇷🇺 Русский</a>
</p>

---

## 🚀 About the Project

**Sonli Usullar** (Numerical Methods) is a modern web platform for solving mathematical equations using numerical methods, working with graphs, and visualizing computational processes.

🔹 **Core Goal** — Make complex mathematical processes **simple, understandable, and interactive**.

---

## 📚 References & Sources

**References**: All primary sources and manuals used in creating this project are available in the `/adabiyotlar` folder in PDF and DOCX formats.

- This project was created using books, scientific articles, and online resources, as well as knowledge provided by Ph.D [Djabbarov Oybek Raxmanovich](https://scholar.google.com/citations?user=H3k2yZ0AAAAJ&hl=ru), head of the Department of Applied Mathematics at Karshi State University and lecturer of the Numerical Methods course.

---

## ✨ Key Features

- ✅ **Modern Interface** — Easy to understand and use
- ✅ **Real-time Graphics** — Visualize computation processes
- ✅ **Detailed Calculations** — Ability to study each step
- ✅ **Responsive Design** — Works on mobile, tablet, and desktop
- ✅ **PWA Technology** — Works offline as well

---

## 📋 Available Numerical Methods

### 🔢 Equation Solving
- **Bisection Method**
- **Simple Iteration Method**
- **Newton's Method (Tangent Method)**
- **Chord Method**
- **Secant Method**
- **Gauss-Seidel Method**
- **Simple Iteration Method for Systems**
- **Gauss-Seidel Method for Systems**
- **Linear Iteration Method**

### 🔀 Eigenvalues and Eigenvectors
- **Krylov Matrix-Vector Method**
- **Danilewski Method**

### 📊 Interpolation and Approximation
- **Lagrange Interpolation**
- **Newton Interpolation**
- **Spline Interpolation**
- **Quadratic Spline Interpolation**

### ∫ Numerical Integration
- **Rectangle Method**
- **Trapezoid Method**
- **Simpson's Method**

---

## 🖼️ Screenshots

<img src=".github/images/home.png" width="100%" alt="Home Page Screenshot"/>

|||
|-|-|
|<img src=".github/images/spline_kvadrat.png"/>|<img src=".github/images/simson_kv_methods.png"/>|

---

## 🛠️ Technology Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=html" height="50"/>
<img src="https://skillicons.dev/icons?i=css" height="50"/>
<img src="https://skillicons.dev/icons?i=js" height="50"/>
<img src="https://skillicons.dev/icons?i=tailwind" height="50"/>

</p>

**Technologies:**
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla & React)
- **Styling**: Tailwind CSS
- **Data Visualization**: Chart.js / Plotly
- **Mobile App**: React Native + Expo
- **PWA**: Service Workers, Manifest
- **Hosting**: Vercel / Netlify

---

## 💻 Getting Started (For Developers)

### Requirements
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourname/sonli-usullar.git
cd sonli-usullar

# Install dependencies
npm install

# Run in development mode
npm run dev

# Create production build
npm run build

# Start the server
npm start
```

### Environment Setup

```bash
# Create .env file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=...
# API_KEY=...
```

---

## 📁 Project Structure

```
sonli-usullar/
├── src/
│   ├── Sonli-Usullar/          # Main Numerical Methods HTML files
│   ├── Sonli-Usullar-Nazariya/ # Theory files
│   ├── assets/
│   │   ├── css/                # CSS stylesheets
│   │   ├── js/                 # JavaScript libraries
│   │   ├── images/             # Images & graphics
│   │   ├── fonts/              # Custom fonts
│   │   └── data/               # Data files
│   ├── about.html              # About page
│   └── privacy.html            # Privacy policy
├── app/                         # React Native Expo
├── docs/                        # Documentation
├── adabiyotlar/                # Reference materials (PDF, DOCX)
├── package.json                # Dependencies & scripts
└── README.md                   # Main documentation
```

---

## 🎯 How to Use

1. **Visit the website**: [sonli-usullar.uz](https://sonli-usullar.uz)
2. **Select a method**: Choose the numerical method you want to explore
3. **Enter data**: Input equations, values, and parameters
4. **View results**: See the calculation process step by step
5. **Analyze graphs**: Use visualizations for deeper understanding

---

## 📊 Features by Method

| Method | Capabilities |
|--------|--------------|
| 🔁 **Iteration Method** | • Input initial value (x₀) <br> • Convergence by precision (ε) <br> • Step-by-step iteration viewing |
| ✂️ **Bisection** | • Work with interval [a, b] <br> • Check root existence <br> • Step-by-step calculation |
| 📈 **Function Intersection** | • Input functions f(x) and g(x) <br> • Draw graphs <br> • Find intersection points |

---

## 🔗 API & Endpoints

### Available Endpoints
- `GET/POST /api/solve/bisection` — Bisection method
- `GET/POST /api/solve/iteration` — Iteration method
- `GET/POST /api/solve/newton` — Newton's method
- `GET/POST /api/interpolate/lagrange` — Lagrange interpolation
- `GET/POST /api/integrate/simpson` — Simpson's integration

### Example Request

```bash
curl -X POST https://sonli-usullar.uz/api/solve/newton \
  -H "Content-Type: application/json" \
  -d '{
    "equation": "x^2 - 2",
    "x0": 1.5,
    "epsilon": 0.0001
  }'
```

---

## 📖 Documentation

Detailed documentation is available in the `/docs` folder:

- [PWA Setup Guide](docs/PWA/PWA-SETUP-GUIDE.md)
- [Performance Guidelines](docs/PERFORMANCE/DRY_VA_PERFORMANCE_TAVSIYALARI.md)
- [SEO Cheat Sheet](docs/SEO-CHEAT-SHEET.md)
- [Image Creation Guide](docs/IMAGE-CREATION-GUIDE.md)
- [PWA Implementation](docs/PWA/PWA-IMPLEMENTATION-SUMMARY.md)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

---

## 🐛 Known Issues & Limitations

- Some methods may have precision issues with very large numbers
- Graph rendering can be slow with extremely complex functions
- Mobile version has limited function input options

Check [Issues](https://github.com/yourname/sonli-usullar/issues) for reported bugs and workarounds.

---

## 🤝 Contributing

We welcome contributions! If you:
- **Found a bug**: Report it in [Issues](https://github.com/yourname/sonli-usullar/issues)
- **Have a feature suggestion**: Open a Pull Request
- **Want to translate**: Contact us

### Contribution Steps
```bash
1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add some AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
```

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow ESLint configuration
- Test your changes

---

## 📜 License

This project is distributed under the **MIT License**. See [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Sonli Usullar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

## 📞 Support & Contact

- **Website**: [sonli-usullar.uz](https://sonli-usullar.uz)
- **Email**: contact@sonli-usullar.uz
- **GitHub Issues**: [Report Issues](https://github.com/yourname/sonli-usullar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourname/sonli-usullar/discussions)

---

## 🙏 Acknowledgments

This project is supported by:

- **Djabbarov Oybek Raxmanovich** (Ph.D, Head of Department of Applied Mathematics, Karshi State University)
- **Karshi State University (QarDU)**
- All contributors and maintainers

---

## 📊 Project Statistics

- **Methods Implemented**: 13+
- **Supported Platforms**: Web, Mobile, PWA
- **Code Lines**: 5000+
- **Documentation Pages**: 20+

---

## 🔄 Roadmap

### Version 2.0 (Coming Soon)
- [ ] Mobile app optimization
- [ ] More interpolation methods
- [ ] Matrix operations
- [ ] Differential equations solver
- [ ] Multi-language support expansion
- [ ] Advanced analytics

### Version 3.0 (Future)
- [ ] AI-powered method recommendation
- [ ] Collaborative problem solving
- [ ] Advanced 3D visualization
- [ ] Real-time collaboration

---

---

## 🌐 Additional Resources

- [Uzbek Guide (Oʻzbekcha Qo'llanma)](README.md)
- [Russian Guide (Ruscha Qo'llanma)](README-ru.md)

---

## 📱 Social Media

Follow us for updates:
- **GitHub**: [@yourname/sonli-usullar](https://github.com/yourname/sonli-usullar)
- **Twitter**: [@sonli_usullar](https://twitter.com/sonli_usullar)
- **Facebook**: [@sonliusullar](https://facebook.com/sonliusullar)

---

## ⭐ Show Your Support

If this project helped you, please:
- ⭐ [Star the repository](https://github.com/yourname/sonli-usullar)
- 🍴 [Fork the project](https://github.com/yourname/sonli-usullar/fork)
- 🔔 Watch for updates

---

<p align="center">
  Made with ❤️ by Sonli Usullar Team
</p>

<p align="center">
  <a href="https://sonli-usullar.uz">Visit Website</a> •
  <a href="https://github.com/yourname/sonli-usullar">GitHub Repository</a> •
  <a href="https://github.com/yourname/sonli-usullar/issues">Report Issues</a>
</p>

<p align="center">
  © 2024 Sonli Usullar. All rights reserved.
</p>
