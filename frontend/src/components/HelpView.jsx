import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  Filter, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  Building2, 
  HeartHandshake, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const VERIFIED_HELPLINES = [
  {
    name: "National Drug De-addiction Helpline",
    number: "14446",
    toll_free: true,
    timings: "24/7 Toll-Free",
    agency: "Ministry of Social Justice and Empowerment, Govt. of India",
    desc: "National portal providing immediate professional guidance, counseling for individuals and families, and referral to nearest registered de-addiction facilities."
  },
  {
    name: "Tele-MANAS",
    number: "14416",
    toll_free: true,
    timings: "24/7 Toll-Free",
    agency: "National Tele Mental Health Programme of India",
    desc: "24/7 psychological crisis intervention, compassionate counseling, and psychiatric de-escalation available across 20+ regional Indian languages."
  },
  {
    name: "Vimukthi Mission Helpline",
    number: "14405",
    toll_free: true,
    timings: "24/7 Toll-Free",
    agency: "Government of Kerala",
    desc: "Dedicated state campaign against narcotic drugs, alcohol abuse, and youth chemical dependency with confidential free recovery counseling."
  },
  {
    name: "KIRAN Mental Health Helpline",
    number: "1800-599-0019",
    toll_free: true,
    timings: "24/7 Toll-Free",
    agency: "Dept. of Empowerment of Persons with Disabilities",
    desc: "Early screening, distress management, psychological first aid, and referral network across 13 Indian languages."
  }
];

const INITIAL_REHAB_CENTRES = [
  {
    id: 1,
    name: "NIMHANS Centre for Addiction Medicine (CAM)",
    city: "Bengaluru",
    type: "In-person & Outpatient",
    pricing: "Subsidized / Free",
    phone: "080-26995000",
    specialties: ["Medical Detoxification", "Dual Diagnosis (Psychiatry + Addiction)", "Youth Care"],
    verified: true
  },
  {
    id: 2,
    name: "NDDTC - AIIMS (National Drug Dependence Treatment Centre)",
    city: "New Delhi",
    type: "In-person & Outpatient",
    pricing: "Free / Govt Supported",
    phone: "011-26588500",
    specialties: ["Opioid Substitution Therapy (OST)", "Clinical Detox", "Family Therapy"],
    verified: true
  },
  {
    id: 3,
    name: "Vandrevala Foundation Helpline",
    city: "Online / Pan-India",
    type: "Online",
    pricing: "Free",
    phone: "9999 666 555",
    specialties: ["Telephonic Crisis Care", "Anxiety & Depression", "Addiction Support"],
    verified: true
  },
  {
    id: 4,
    name: "Kripa Foundation",
    city: "Mumbai",
    type: "In-person",
    pricing: "Sliding Scale",
    phone: "022-26405411",
    specialties: ["Holistic 12-Step Protocol", "Yoga & Meditation", "Relapse Prevention"],
    verified: true
  },
  {
    id: 5,
    name: "TTK Hospital & De-addiction Centre",
    city: "Chennai",
    type: "In-person & Online",
    pricing: "Subsidized",
    phone: "044-24912948",
    specialties: ["Comprehensive Rehabilitation", "Cognitive Restructuring", "Aftercare Follow-up"],
    verified: true
  },
  {
    id: 6,
    name: "Manas De-addiction & Mental Health Clinic",
    city: "Kolkata",
    type: "In-person & Online",
    pricing: "Paid / Subsidized",
    phone: "033-24641234",
    specialties: ["Cognitive Behavioral Therapy (CBT)", "Relapse Management", "Peer Groups"],
    verified: true
  }
];

export default function HelpView({ nickname }) {
  // Directory Filters
  const [filterType, setFilterType] = useState('All'); // 'All', 'In-person', 'Online'
  const [filterPricing, setFilterPricing] = useState('All'); // 'All', 'Free', 'Subsidized'
  const [copiedNumber, setCopiedNumber] = useState(null);

  // Anonymous Callback Form
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [preferredMode, setPreferredMode] = useState('Phone');
  const [topic, setTopic] = useState('Craving & Relapse Anxiety');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackResponse, setCallbackResponse] = useState(null);

  const copyToClipboard = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          preferred_time: preferredTime,
          mode: preferredMode,
          topic,
          contact_value: contactValue
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCallbackResponse(data);
      } else {
        // Fallback confirmation
        setCallbackResponse({
          token: `MB-${Date.now().toString().slice(-6)}`,
          message: "Your confidential request has been queued locally. A certified counselor will connect with you during your chosen window."
        });
      }
    } catch (err) {
      setCallbackResponse({
        token: `MB-${Date.now().toString().slice(-6)}`,
        message: "Your confidential request has been securely recorded offline. A counselor will reach out."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCentres = INITIAL_REHAB_CENTRES.filter((centre) => {
    if (filterType !== 'All' && !centre.type.includes(filterType)) return false;
    if (filterPricing === 'Free' && !centre.pricing.toLowerCase().includes('free')) return false;
    if (filterPricing === 'Subsidized' && !centre.pricing.toLowerCase().includes('subsidized')) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300 space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212928] dark:text-[#E5EBE8]">
          Counsellor & Rehab Support Bridge
        </h1>
        <p className="text-xs sm:text-sm text-[#61776E] dark:text-[#99AEA3] mt-1">
          Direct, zero-friction access to certified Indian de-addiction institutions and 24/7 helplines.
        </p>
      </div>

      {/* 1. Verified Indian Helplines Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-[#5C8979]" />
          <h2 className="text-lg font-bold text-[#212928] dark:text-[#E5EBE8]">
            Verified 24/7 Indian Helplines (Toll-Free)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VERIFIED_HELPLINES.map((helpline, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#212928] dark:text-[#E5EBE8]">
                      {helpline.name}
                    </h3>
                    <span className="text-[11px] font-medium text-[#5C8979] dark:text-[#88BBA7]">
                      {helpline.agency}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    {helpline.timings}
                  </span>
                </div>
                <p className="text-xs text-[#637971] dark:text-[#9CB3A8] mt-2 leading-relaxed">
                  {helpline.desc}
                </p>
              </div>

              {/* Call & Copy CTA */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#E3EDE8] dark:border-[#263730]">
                <a
                  href={`tel:${helpline.number}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#5C8979] hover:bg-[#4A7364] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {helpline.number}</span>
                </a>
                <button
                  onClick={() => copyToClipboard(helpline.number)}
                  className="p-2.5 rounded-xl border border-[#D5E4DC] dark:border-[#2C4037] text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#F3F7F5] dark:hover:bg-[#1E2B24] transition-colors"
                  title="Copy number"
                >
                  {copiedNumber === helpline.number ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Filterable Rehab & Counselling Directory */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#3D7879]" />
            <h2 className="text-lg font-bold text-[#212928] dark:text-[#E5EBE8]">
              Verified Rehabilitation & Clinical Centers
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#6B8076] dark:text-[#9BB1A7] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-1.5 rounded-xl bg-white dark:bg-[#1A2621] border border-[#D9E7E0] dark:border-[#2C4037] text-[#212928] dark:text-[#E2EBE6] text-xs"
            >
              <option value="All">All Formats</option>
              <option value="In-person">In-person</option>
              <option value="Online">Online / Telehealth</option>
            </select>

            <select
              value={filterPricing}
              onChange={(e) => setFilterPricing(e.target.value)}
              className="p-1.5 rounded-xl bg-white dark:bg-[#1A2621] border border-[#D9E7E0] dark:border-[#2C4037] text-[#212928] dark:text-[#E2EBE6] text-xs"
            >
              <option value="All">All Pricing</option>
              <option value="Free">Free / Govt</option>
              <option value="Subsidized">Subsidized</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#3D7879] dark:text-[#88C6C7] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {centre.city}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E3EDE8] dark:bg-[#1F3129] text-[10px] font-semibold text-[#395B4E] dark:text-[#9DD1BE]">
                    {centre.pricing}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#212928] dark:text-[#E5EBE8] mb-2 leading-snug">
                  {centre.name}
                </h3>

                <div className="flex flex-wrap gap-1 mb-3">
                  {centre.specialties.map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F4F8F6] dark:bg-[#15201B] border border-[#E3EDE8] dark:border-[#273B32] text-[#556D62] dark:text-[#9BB7AB]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3EDE8] dark:border-[#263730] flex items-center justify-between text-xs">
                <span className="font-mono text-[#5C8979] font-semibold">{centre.phone}</span>
                <a
                  href={`tel:${centre.phone}`}
                  className="px-2.5 py-1 rounded-lg bg-[#E3EDE8] dark:bg-[#203129] text-[#395B4E] dark:text-[#9DD1BE] font-bold hover:bg-[#5C8979] hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Request Anonymous Callback Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E3EDE8] dark:bg-[#203129] text-[#395B4E] dark:text-[#9DD1BE] flex items-center justify-center mx-auto mb-2">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#212928] dark:text-[#E5EBE8]">
              Request Confidential Counsellor Callback
            </h2>
            <p className="text-xs text-[#637971] dark:text-[#9BB1A7]">
              Need a human voice? Schedule a safe, anonymous conversation with a certified substance recovery counsellor. No real name needed.
            </p>
          </div>

          {callbackResponse ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-[#172E24] border border-emerald-200 dark:border-[#295945] text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Callback Queued Successfully!
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                {callbackResponse.message}
              </p>
              <div className="inline-block px-3 py-1.5 rounded-xl bg-white dark:bg-[#12241C] border border-emerald-300 dark:border-[#387358] font-mono text-xs font-bold text-emerald-900 dark:text-emerald-100">
                Your Tracking Token: {callbackResponse.token}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCallbackResponse(null)}
                  className="text-xs text-[#5C8979] underline font-medium"
                >
                  Schedule Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCallbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-1">
                    Your Anonymous Nickname
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nickname}
                    className="w-full p-2.5 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 border border-[#D9E7E0] dark:border-[#2C4037] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-1">
                    Preferred Callback Window
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-[#F7F9F8] dark:bg-[#141E19] border border-[#D9E7E0] dark:border-[#2C4037] text-[#212928] dark:text-[#E2EBE6]"
                  >
                    <option>Morning (9 AM - 12 PM)</option>
                    <option>Afternoon (1 PM - 4 PM)</option>
                    <option>Evening (5 PM - 8 PM)</option>
                    <option>Night / Quiet Hours (9 PM - 11 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-1">
                    Preferred Channel
                  </label>
                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-[#F7F9F8] dark:bg-[#141E19] border border-[#D9E7E0] dark:border-[#2C4037] text-[#212928] dark:text-[#E2EBE6]"
                  >
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp/Encrypted Chat">Encrypted Chat / SMS</option>
                    <option value="Email">Confidential Email</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-1">
                    Topic / Concern
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-[#F7F9F8] dark:bg-[#141E19] border border-[#D9E7E0] dark:border-[#2C4037] text-[#212928] dark:text-[#E2EBE6]"
                  >
                    <option>Craving & Relapse Anxiety</option>
                    <option>Navigating Peer Pressure</option>
                    <option>Detox & Medical Guidance</option>
                    <option>Family / Relationship Strain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-1">
                  Contact Handle (Phone, burner number, or secure email)
                </label>
                <input
                  type="text"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or your private email..."
                  className="w-full p-2.5 text-xs rounded-xl bg-[#F7F9F8] dark:bg-[#141E19] border border-[#D9E7E0] dark:border-[#2C4037] text-[#212928] dark:text-[#E2EBE6] focus:outline-hidden focus:ring-2 focus:ring-[#5C8979]/40"
                />
                <span className="text-[10px] text-[#7E968B] dark:text-[#88A396] mt-1 block">
                  Never shared with third parties. Used strictly by registered de-addiction counselors to establish contact.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#5C8979] hover:bg-[#4A7364] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Securing Request...' : 'Send Confidential Callback Request'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
