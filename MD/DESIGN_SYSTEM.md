# KOTARO AI - Design System & Code Guide

## 📋 Table of Contents
1. [Color Palette](#color-palette)
2. [Typography System](#typography-system)
3. [Layout & Grid System](#layout--grid-system)
4. [Component Library](#component-library)
5. [Animation & Effects](#animation--effects)
6. [Responsive Design](#responsive-design)
7. [Code Patterns](#code-patterns)
8. [File Structure](#file-structure)
9. [Implementation Guide](#implementation-guide)

---

## 🎨 Color Palette

### Primary Colors
```css
/* Dark Theme Base */
--primary-dark: #1c1d26;      /* Main background */
--secondary-dark: #2a2b36;    /* Secondary background */
--accent-green: #73d239;      /* Primary accent */
--accent-green-hover: #8ee63e; /* Hover state */
--accent-blue: #059669;       /* Secondary accent */
--accent-teal: #10b981;       /* Tertiary accent */
```

### Text Colors
```css
--text-primary: #ffffff;                    /* Main text */
--text-secondary: rgba(255, 255, 255, 0.75); /* Secondary text */
--text-muted: rgba(255, 255, 255, 0.5);     /* Muted text */
--text-accent: #73d239;                     /* Accent text */
```

### Background Gradients
```css
/* Banner Background */
background: linear-gradient(135deg, #0f0f23 0%, #1c1d26 25%, #2a2b36 50%, #1c1d26 75%, #0f0f23 100%);

/* Section Background */
background: linear-gradient(135deg, #1c1d26 0%, #2a2b36 100%);

/* Glass Effect Background */
background: rgba(15, 15, 35, 0.9);
backdrop-filter: blur(20px);
```

### Transparency & Overlays
```css
--overlay-light: rgba(255, 255, 255, 0.1);
--overlay-medium: rgba(255, 255, 255, 0.3);
--overlay-dark: rgba(0, 0, 0, 0.5);
--accent-overlay: rgba(115, 210, 57, 0.1);
```

---

## 📝 Typography System

### Font Family
```css
font-family: "Roboto", Helvetica, sans-serif;
```

### Font Weights
```css
--font-light: 100;
--font-normal: 300;
--font-medium: 500;
--font-bold: 700;
--font-black: 800;
```

### Font Sizes (Responsive)
```css
/* Desktop */
--text-xs: 0.9rem;      /* 14.4px */
--text-sm: 1.1rem;      /* 17.6px */
--text-base: 1.2rem;    /* 19.2px */
--text-lg: 1.4rem;      /* 22.4px */
--text-xl: 2rem;        /* 32px */
--text-2xl: 3.5rem;     /* 56px */
--text-3xl: 5.5rem;     /* 88px */
--text-4xl: 6.5rem;     /* 104px */

/* Mobile Adjustments */
@media (max-width: 736px) {
    --text-3xl: 2.5rem;  /* 40px */
    --text-4xl: 3rem;    /* 48px */
}
```

### Line Heights
```css
--leading-tight: 1.1;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

---

## 🏗️ Layout & Grid System

### Container System
```css
.container {
    margin: 0 auto;
    max-width: 1800px;  /* Banner */
    max-width: 1600px;  /* Sections */
    width: 95-98%;
    padding: 0 2em;
}

/* Responsive Breakpoints */
--breakpoint-xs: 480px;
--breakpoint-sm: 736px;
--breakpoint-md: 980px;
--breakpoint-lg: 1280px;
--breakpoint-xl: 1680px;
```

### Grid Layouts
```css
/* Two Column Layout */
.section-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4-6rem;
    align-items: center;
}

/* Three Column Layout */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1-2rem;
}

/* Responsive Grid */
@media (max-width: 980px) {
    .section-content {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}
```

### Spacing System
```css
--space-xs: 0.5rem;    /* 8px */
--space-sm: 1rem;      /* 16px */
--space-md: 1.5rem;    /* 24px */
--space-lg: 2rem;      /* 32px */
--space-xl: 3rem;      /* 48px */
--space-2xl: 4rem;     /* 64px */
--space-3xl: 6rem;     /* 96px */
--space-4xl: 8rem;     /* 128px */
```

---

## 🧩 Component Library

### 1. Badge Component
```html
<div class="section-badge">
    <span class="badge-icon">🚀</span>
    <span class="badge-text">AI-Powered Education</span>
</div>
```

```css
.section-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(115, 210, 57, 0.1);
    border: 1px solid rgba(115, 210, 57, 0.3);
    border-radius: 50px;
    padding: 0.5rem 1rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
}

.badge-icon {
    font-size: 1.2rem;
    animation: pulse 2s ease-in-out infinite;
}

.badge-text {
    color: #73d239;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

### 2. Button Components
```html
<!-- Primary Button -->
<a href="#" class="btn-primary">
    <span class="btn-text">Trải nghiệm AI ngay</span>
    <span class="btn-icon">→</span>
</a>

<!-- Secondary Button -->
<a href="#" class="btn-secondary">
    <span class="btn-text">Tìm hiểu thêm</span>
</a>
```

```css
.btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 2.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.2rem;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
}

.btn-primary {
    background: linear-gradient(135deg, #73d239, #059669);
    color: #ffffff;
    border: none;
    box-shadow: 
        0 10px 30px rgba(115, 210, 57, 0.3),
        0 0 0 1px rgba(115, 210, 57, 0.2);
}

.btn-primary:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 
        0 20px 40px rgba(115, 210, 57, 0.4),
        0 0 0 1px rgba(115, 210, 57, 0.3);
}

.btn-secondary {
    background: transparent;
    color: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(115, 210, 57, 0.4);
}

.btn-secondary:hover {
    background: rgba(115, 210, 57, 0.1);
    border-color: rgba(115, 210, 57, 0.6);
    transform: translateY(-3px);
}
```

### 3. Card Components
```html
<div class="feature-card">
    <div class="card-icon">🧠</div>
    <div class="card-text">AI Thông minh</div>
</div>
```

```css
.feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: rgba(115, 210, 57, 0.1);
    border: 1px solid rgba(115, 210, 57, 0.2);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.feature-card:hover {
    background: rgba(115, 210, 57, 0.15);
    border-color: rgba(115, 210, 57, 0.4);
    transform: translateY(-5px);
}

.card-icon {
    font-size: 3rem;
}

.card-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.4rem;
    font-weight: 500;
    text-align: center;
}
```

### 4. Stats Component
```html
<div class="stat-item">
    <div class="stat-number">1000+</div>
    <div class="stat-label">Thí nghiệm ảo</div>
</div>
```

```css
.stat-item {
    text-align: center;
    padding: 2rem;
    background: rgba(115, 210, 57, 0.1);
    border: 1px solid rgba(115, 210, 57, 0.2);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.stat-item:hover {
    background: rgba(115, 210, 57, 0.15);
    border-color: rgba(115, 210, 57, 0.4);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(115, 210, 57, 0.2);
}

.stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: #73d239;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 15px rgba(115, 210, 57, 0.4);
}

.stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    font-weight: 500;
}
```

### 5. Glass Effect Component
```css
.glass {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 25px;
    border: 1px solid rgba(115, 210, 57, 0.3);
    box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(115, 210, 57, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

---

## ✨ Animation & Effects

### 1. Keyframe Animations
```css
/* Slide In Animations */
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Floating Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes orbFloat {
    0%, 100% { 
        transform: translateY(0px) scale(1); 
        opacity: 0.4; 
    }
    50% { 
        transform: translateY(-30px) scale(1.1); 
        opacity: 0.6; 
    }
}

/* Glow Effects */
@keyframes glowPulse {
    0%, 100% { 
        opacity: 0.3; 
        transform: scale(1); 
    }
    50% { 
        opacity: 0.6; 
        transform: scale(1.1); 
    }
}

/* Gradient Shift */
@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

/* Pulse Animation */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

### 2. Hover Effects
```css
/* Card Hover */
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(115, 210, 57, 0.2);
}

/* Button Hover */
.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(115, 210, 57, 0.3);
}

/* Image Hover */
.image:hover img {
    transform: scale(1.05);
    filter: brightness(1.1);
}
```

### 3. Transition Classes
```css
/* Standard Transitions */
.transition-fast { transition: all 0.2s ease; }
.transition-normal { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }

/* Transform Transitions */
.hover-lift:hover { transform: translateY(-5px); }
.hover-scale:hover { transform: scale(1.05); }
.hover-rotate:hover { transform: rotate(5deg); }
```

---

## 📱 Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
/* Base styles for mobile */

/* Small tablets */
@media screen and (min-width: 480px) {
    /* Small tablet styles */
}

/* Tablets */
@media screen and (min-width: 736px) {
    /* Tablet styles */
}

/* Small desktops */
@media screen and (min-width: 980px) {
    /* Small desktop styles */
}

/* Large desktops */
@media screen and (min-width: 1280px) {
    /* Large desktop styles */
}

/* Extra large screens */
@media screen and (min-width: 1680px) {
    /* Extra large screen styles */
}
```

### Responsive Typography
```css
/* Fluid Typography */
.title-line {
    font-size: clamp(2rem, 5vw, 5.5rem);
}

.section-description {
    font-size: clamp(1rem, 2vw, 1.2rem);
}
```

### Responsive Grid
```css
.section-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 980px) {
    .section-content {
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
    }
}
```

---

## 💻 Code Patterns

### 1. Section Structure
```html
<section id="section-name" class="modern-section">
    <!-- Background Elements -->
    <div class="section-background">
        <div class="bg-overlay"></div>
        <div class="floating-elements">
            <div class="float-element" data-speed="0.5"></div>
            <div class="float-element" data-speed="0.8"></div>
            <div class="float-element" data-speed="1.2"></div>
        </div>
    </div>
    
    <!-- Content Container -->
    <div class="container">
        <div class="section-content">
            <!-- Left Content -->
            <div class="content-left">
                <div class="content-wrapper">
                    <div class="section-badge">
                        <span class="badge-icon">🚀</span>
                        <span class="badge-text">Section Title</span>
                    </div>
                    <h2 class="section-title">
                        <span class="title-line">Main Title</span>
                        <span class="title-line highlight">Highlighted</span>
                    </h2>
                    <p class="section-description">
                        Section description text...
                    </p>
                    <div class="cta-buttons">
                        <a href="#" class="btn-primary">
                            <span class="btn-text">Primary Action</span>
                            <span class="btn-icon">→</span>
                        </a>
                        <a href="#" class="btn-secondary">
                            <span class="btn-text">Secondary Action</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Right Content -->
            <div class="content-right">
                <div class="image-showcase">
                    <div class="main-image">
                        <img src="image.jpg" alt="Description" />
                    </div>
                    <div class="floating-card card-1">
                        <div class="card-icon">📊</div>
                        <div class="card-text">Floating info</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

### 2. CSS Organization Pattern
```css
/* 1. Base Styles */
.element {
    /* Layout */
    display: flex;
    position: relative;
    
    /* Sizing */
    width: 100%;
    height: auto;
    
    /* Spacing */
    padding: 2rem;
    margin: 0;
    
    /* Colors */
    background: var(--primary-dark);
    color: var(--text-primary);
    
    /* Typography */
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.5;
    
    /* Borders & Shadows */
    border: 1px solid var(--accent-green);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    /* Effects */
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

/* 2. States */
.element:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(115, 210, 57, 0.2);
}

.element:focus {
    outline: 2px solid var(--accent-green);
    outline-offset: 2px;
}

/* 3. Modifiers */
.element--large {
    padding: 3rem;
    font-size: 1.5rem;
}

.element--accent {
    background: var(--accent-green);
    color: var(--primary-dark);
}

/* 4. Responsive */
@media (max-width: 980px) {
    .element {
        padding: 1.5rem;
        font-size: 1rem;
    }
}
```

### 3. JavaScript Patterns
```javascript
// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});
```

---

## 📁 File Structure

```
assets/
├── css/
│   ├── main.css              # Base styles, layout, typography
│   ├── modern-ui.css         # Modern components, animations
│   ├── cuon-trang.css        # Scroll effects
│   └── noscript.css          # No JavaScript fallbacks
├── js/
│   ├── main.js               # Core functionality
│   ├── modern-ui.js          # Modern interactions
│   ├── cuon-trang.js         # Scroll animations
│   └── logic_email.js        # Form handling
├── sass/
│   ├── main.scss             # SCSS source
│   ├── libs/                 # SCSS libraries
│   └── _vars.scss            # Variables
└── images/
    ├── logo-v2.jpg           # Main logo
    ├── overlay.png           # Overlay textures
    └── arrow.svg             # Icons
```

---

## 🚀 Implementation Guide

### 1. Setup New Page
```html
<!DOCTYPE HTML>
<html>
<head>
    <title>Page Title - KOTARO AI</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    
    <!-- CSS Files -->
    <link rel="stylesheet" href="assets/css/main.css" />
    <link rel="stylesheet" href="assets/css/modern-ui.css" />
    <link rel="stylesheet" href="assets/css/cuon-trang.css" />
    
    <!-- Favicon -->
    <link rel="icon" href="hinh-anh/logo-Photoroom.png" type="image/x-jpg">
</head>
<body class="is-preload">
    <!-- Header -->
    <header id="header">
        <!-- Navigation structure -->
    </header>
    
    <!-- Main Content -->
    <div id="page-wrapper">
        <!-- Your sections here -->
    </div>
    
    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/modern-ui.js"></script>
    <script src="assets/js/cuon-trang.js"></script>
</body>
</html>
```

### 2. Create Section Template
```html
<section id="section-id" class="modern-section">
    <!-- Background -->
    <div class="section-background">
        <div class="bg-overlay"></div>
        <div class="floating-elements">
            <div class="float-element" data-speed="0.5"></div>
            <div class="float-element" data-speed="0.8"></div>
        </div>
    </div>
    
    <!-- Content -->
    <div class="container">
        <div class="section-content">
            <!-- Your content here -->
        </div>
    </div>
</section>
```

### 3. CSS Customization
```css
/* Custom section styles */
#your-section {
    background: linear-gradient(135deg, #1c1d26 0%, #2a2b36 100%);
}

#your-section .title-line {
    font-size: 4rem;
    color: #73d239;
}

#your-section .feature-card {
    background: rgba(115, 210, 57, 0.15);
    border-color: rgba(115, 210, 57, 0.4);
}
```

### 4. Animation Integration
```javascript
// Add animation classes
document.querySelector('#your-section').classList.add('fade-up');

// Custom animations
const customAnimation = () => {
    const elements = document.querySelectorAll('.your-element');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
        el.classList.add('slideInUp');
    });
};
```

---

## 🎯 Best Practices

### 1. Performance
- Use `transform` and `opacity` for animations
- Implement lazy loading for images
- Minimize DOM queries
- Use CSS custom properties for theming

### 2. Accessibility
- Maintain proper contrast ratios
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation

### 3. Maintainability
- Use consistent naming conventions
- Organize CSS with comments
- Create reusable components
- Document custom modifications

### 4. Browser Support
- Test on multiple browsers
- Use fallbacks for modern CSS
- Progressive enhancement approach
- Mobile-first responsive design

---

## 📚 Additional Resources

### CSS References
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

### JavaScript References
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS Object Model](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model)

### Design Resources
- [Color Theory](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)
- [Typography Guidelines](https://www.smashingmagazine.com/2011/03/how-to-establish-a-typographic-hierarchy/)
- [Animation Principles](https://www.smashingmagazine.com/2014/04/css3-transitions-thanks-to-mobile/)

---

*This design system is specifically tailored for KOTARO AI educational platform and can be extended and modified as needed for different projects.* 