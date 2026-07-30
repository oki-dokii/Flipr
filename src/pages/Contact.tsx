import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about LoadOptimize or need custom enterprise integration? Send us a message and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="glass-card p-8 border border-white/10 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <div className="font-semibold">Email Us</div>
                      <div className="text-muted-foreground">support@loadoptimize.com</div>
                      <div className="text-muted-foreground">sales@loadoptimize.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-cyan" />
                    </div>
                    <div>
                      <div className="font-semibold">Call Us</div>
                      <div className="text-muted-foreground">+91 (022) 8000-OPTIMIZE</div>
                      <div className="text-muted-foreground">Mon - Fri, 9am - 6pm IST</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Headquarters</div>
                      <div className="text-muted-foreground">LoadOptimize Logistics Tech Hub</div>
                      <div className="text-muted-foreground">BKC Financial District, Mumbai 400051</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-muted-foreground">
                Flipr Hackathon 30.1 Fullstack Web Project Submission
              </div>
            </div>

            {/* Form */}
            <div className="glass-card p-8 border border-white/10">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-teal mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Thank you for reaching out. A representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="john@company.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Subject</label>
                    <input
                      required
                      type="text"
                      placeholder="Demo request / Integration query"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your logistics requirements..."
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-teal"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-teal to-cyan text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    Submit Request <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
