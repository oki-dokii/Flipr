
export const translations = {
    en: {
        'dashboard': 'Dashboard',
        'login': 'Login',
        'get_started': 'Get Started',
        'home': 'Home',
        'features': 'Features',
        'results': 'Results',
        'welcome_back': 'Welcome Back',
        'sign_in': 'Sign In',
        'email': 'Email',
        'password': 'Password',
        'dont_have_account': "Don't have an account?",
        'sign_up': 'Sign up',
        'monitoring_dashboard': 'Monitoring Dashboard',
        'intelligence_center': 'Intelligence Center',
        'open_hub': 'Open Intelligence Hub'
    },
    hi: {
        'dashboard': 'डैशबोर्ड',
        'login': 'लॉगिन',
        'get_started': 'शुरू करें',
        'home': 'होम',
        'features': 'सुविधाएँ',
        'results': 'परिणाम',
        'welcome_back': 'वापसी पर स्वागत है',
        'sign_in': 'साइन इन करें',
        'email': 'ईमेल',
        'password': 'पासवर्ड',
        'dont_have_account': 'खाता नहीं है?',
        'sign_up': 'साइन अप करें',
        'monitoring_dashboard': 'निगरानी डैशबोर्ड',
        'intelligence_center': 'इंटेलिजेंस केंद्र',
        'open_hub': 'इंटेलिजेंस हब खोलें'
    },
    as: {
        'dashboard': 'डैशब’र्ड',
        'login': 'लगित',
        'get_started': 'आरंभ कडिब',
        'home': 'मुल',
        'features': 'बिहह',
        'results': 'फलाफल',
        'welcome_back': 'पुनरागमन आदरणीय',
        'sign_in': 'प्रवेश',
        'email': 'ई-मेल',
        'password': 'पासवर्ड',
        'dont_have_account': 'एकाउन्ट नाही?',
        'sign_up': 'पञ्जीकरण',
        'monitoring_dashboard': 'पर्यवेक्षण डैशब’र्ड',
        'intelligence_center': 'बुद्धिबृत्ति केन्द्र',
        'open_hub': 'हब खोलक'
    }
};

export type Language = 'en' | 'hi' | 'as';

// Languages supported by Google Translate + Our Manual Overrides
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' }
];
