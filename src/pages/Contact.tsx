import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Github, Linkedin, FileText, X, Loader2 } from 'lucide-react';
import { emailService, ContactFormData } from '../services/emailService';
import { useToast } from '../contexts/ToastContext';
import ScrollReveal from '../components/ScrollReveal';
import StaggeredContainer from '../components/StaggeredContainer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  const { showToast } = useToast();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return emailService.validateEmail(value) ? '' : 'Please enter a valid email address';
      case 'message':
        if (!value.trim()) return 'Message is required';
        return value.trim().length >= 10 ? '' : 'Message must be at least 10 characters long';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validation = emailService.validateForm(formData);
    if (!validation.isValid) {
      const fieldErrors: { [key: string]: string } = {};
      validation.errors.forEach(error => {
        if (error.includes('Name')) fieldErrors.name = error;
        if (error.includes('Email') || error.includes('email')) fieldErrors.email = error;
        if (error.includes('Message')) fieldErrors.message = error;
      });
      setErrors(fieldErrors);
      setTouched({ name: true, email: true, message: true });
      showToast('error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await emailService.sendEmail(formData);
      showToast('success', 'Message sent successfully! I\'ll get back to you soon.');
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
    } catch (error: any) {
      console.error('Email sending failed:', error);
      
      // Show error with fallback contact information
      const errorMessage = error.message || 'Failed to send message. Please try again.';
      
      if (errorMessage.includes('not configured') || 
          errorMessage.includes('samarh260805@gmail.com') ||
          errorMessage.includes('authentication scopes') ||
          errorMessage.includes('temporarily unavailable')) {
        showToast('error', 'Email service temporarily unavailable. Please contact me directly at samarh260805@gmail.com or connect via LinkedIn/GitHub.');
      } else {
        showToast('error', `${errorMessage} Please try contacting me directly at samarh260805@gmail.com`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleResumeClick = () => {
    window.open('https://drive.google.com/file/d/1tX76E16RmcObE6V0xnYbvHG8vqsCqenS/view?usp=sharing', '_blank');
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Samarth-Codes', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/samarth-codes/', label: 'LinkedIn' },
    { icon: X, href: 'https://x.com/SamarthSax34564', label: 'X' }
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'samarh260805@gmail.com', href: 'mailto:samarh260805@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 9810818189', href: 'tel:+919810818189' },
    { icon: MapPin, label: 'Location', value: 'New Delhi, INDIA', href: '#' }
  ];

  return (
    <main className="flex-grow pt-20">
      <section className="py-24 px-4 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal direction="down" delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="heading-h1 text-primary-color mb-8">
                CONNECT
              </h1>
              <p className="text-lead text-secondary-color max-w-3xl mx-auto text-readable">
                Ready to bring your digital vision to life? Let's collaborate on something extraordinary.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <ScrollReveal direction="left" delay={0.2}>
              <div className="order-2 lg:order-1">
              <h2 className="heading-h2 text-primary-color mb-6 sm:mb-8 text-center lg:text-left">
                SEND MESSAGE
              </h2>
              {/* Email Service Status Notice */}
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  📧 Email service is currently being configured. For immediate contact, please reach out directly at{' '}
                  <a href="mailto:samarh260805@gmail.com" className="text-yellow-300 hover:text-yellow-200 underline">
                    samarh260805@gmail.com
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-label text-primary-color mb-2">
                    NAME {errors.name && <span className="text-red-400 text-body-sm font-normal">- {errors.name}</span>}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`input-neon w-full px-4 py-3 bg-black/50 border text-text-primary placeholder-text-secondary focus:outline-none transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-400 focus:border-red-400 shadow-red-400/20' 
                        : 'border-border-color focus:border-primary'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-label text-primary-color mb-2">
                    EMAIL {errors.email && <span className="text-red-400 text-body-sm font-normal">- {errors.email}</span>}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`input-neon w-full px-4 py-3 bg-black/50 border text-text-primary placeholder-text-secondary focus:outline-none transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-400 shadow-red-400/20' 
                        : 'border-border-color focus:border-primary'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-label text-primary-color mb-2">
                    MESSAGE {errors.message && <span className="text-red-400 text-body-sm font-normal">- {errors.message}</span>}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    rows={6}
                    className={`input-neon w-full px-4 py-3 bg-black/50 border text-text-primary placeholder-text-secondary focus:outline-none transition-all duration-300 resize-none ${
                      errors.message 
                        ? 'border-red-400 focus:border-red-400 shadow-red-400/20' 
                        : 'border-border-color focus:border-primary'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-button border-2 flex items-center justify-center gap-3 clickable transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-600 text-gray-300 border-gray-600 cursor-not-allowed'
                      : 'bg-primary text-black border-primary hover:bg-opacity-90'
                  }`}
                  style={!isSubmitting ? { color: '#000' } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      SEND MESSAGE
                    </>
                  )}
                </button>
              </form>
              </div>
            </ScrollReveal>

            {/* Contact Information */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="order-1 lg:order-2">
              <h2 className="heading-h2 text-primary-color mb-6 sm:mb-8 text-center lg:text-left">
                GET IN TOUCH
              </h2>
              
              {/* Contact Info */}
              <StaggeredContainer 
                staggerDelay={0.1} 
                className="space-y-4 sm:space-y-6 mb-8 sm:mb-12"
              >
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center gap-4 p-4 bg-black/30 border border-border-color group clickable transition-all duration-300 hover:border-primary/50"
                  >
                    <div className="w-12 h-12 bg-primary/20 border border-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-caption text-secondary-color">
                        {info.label}
                      </div>
                      <div className="text-body text-primary-color font-semibold">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </StaggeredContainer>

              {/* Social Links */}
              <div className="mb-8 sm:mb-12">
                <h3 className="heading-h4 text-primary-color mb-4 sm:mb-6 text-center lg:text-left">
                  CONNECT WITH ME
                </h3>
                <StaggeredContainer 
                  staggerDelay={0.1} 
                  className="flex gap-3 sm:gap-4 justify-center lg:justify-start"
                >
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 border border-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-black clickable transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  ))}
                </StaggeredContainer>
              </div>

              {/* Quick Contact Buttons */}
              <StaggeredContainer 
                staggerDelay={0.2} 
                className="space-y-3 sm:space-y-4"
              >
                <a 
                  href="mailto:hello@samarthcodes.com"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-transparent text-primary border-2 border-primary text-button hover:bg-primary hover:text-black clickable transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  START CONVERSATION
                </a>
                
                <button 
                  onClick={handleResumeClick}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-orange-500 text-black border-2 border-orange-500 text-button hover:bg-orange-400 clickable transition-all duration-300"
                  style={{ color: '#000' }}
                >
                  <FileText className="w-5 h-5" />
                  VIEW RESUME
                </button>
              </StaggeredContainer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
