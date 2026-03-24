import React, { useState } from 'react';
import { MapPin, ExternalLink, Clock, Users, Video, Phone, Search, Info } from 'lucide-react';

const MEETING_TYPES = [
  {
    name: 'Alcoholics Anonymous (AA)',
    description: '12-step program for alcohol recovery',
    website: 'https://www.aa.org/find-aa',
    phone: '1-212-870-3400',
    types: ['Open', 'Closed', 'Speaker', 'Big Book Study'],
    color: '#3b82f6'
  },
  {
    name: 'Narcotics Anonymous (NA)',
    description: '12-step program for drug addiction recovery',
    website: 'https://www.na.org/meetingsearch/',
    phone: '1-818-773-9999',
    types: ['Open', 'Closed', 'Literature', 'Step Study'],
    color: '#8b5cf6'
  },
  {
    name: 'SMART Recovery',
    description: 'Science-based, self-empowerment support',
    website: 'https://www.smartrecovery.org/community/',
    phone: '1-866-951-5357',
    types: ['In-person', 'Online', 'Phone', 'Teen/Youth'],
    color: '#10b981'
  },
  {
    name: 'Cocaine Anonymous (CA)',
    description: '12-step program for cocaine addiction',
    website: 'https://ca.org/meetings/',
    phone: '1-310-559-5833',
    types: ['Open', 'Closed', 'Step Study', 'Speaker'],
    color: '#f59e0b'
  },
  {
    name: 'Al-Anon / Nar-Anon',
    description: 'Support for families and friends of addicts',
    website: 'https://al-anon.org/al-anon-meetings/',
    phone: 'Al-Anon: 1-888-425-2666',
    types: ['Family Support', 'Spouse/Partner', 'Adult Children'],
    color: '#ec4899'
  },
  {
    name: 'Celebrate Recovery',
    description: 'Christ-centered 12-step program',
    website: 'https://www.celebraterecovery.com/crgroups',
    phone: '1-949-581-7138',
    types: ['Open', 'Gender-specific', 'Youth', 'Step Study'],
    color: '#06b6d4'
  },
];

const ONLINE_PLATFORMS = [
  { name: 'In The Rooms', url: 'https://www.intherooms.com/', desc: '24/7 online meetings' },
  { name: 'AA Intergroup', url: 'https://aa-intergroup.org/', desc: 'Online AA meetings worldwide' },
  { name: 'SMART Recovery Online', url: 'https://www.smartrecovery.org/community/', desc: 'Online SMART meetings' },
  { name: 'Refuge Recovery', url: 'https://refugerecovery.org/meetings', desc: 'Buddhist-based recovery' },
];

export default function MeetingFinder() {
  const [searchZip, setSearchZip] = useState('');
  const [expandedType, setExpandedType] = useState(null);

  const handleSearch = (url) => {
    let searchUrl = url;
    if (searchZip && url.includes('meetingsearch')) {
      searchUrl = `${url}?zip=${searchZip}`;
    }
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Find Meetings</h1>
        <p className="text-gray-400 text-sm">Connect with support groups near you or online</p>
      </div>

      {/* Quick Search */}
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/30 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-semibold text-sm">Quick Search</h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchZip}
            onChange={e => setSearchZip(e.target.value)}
            placeholder="Enter ZIP code (optional)"
            className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSearch(MEETING_TYPES[0].website)}
            className="px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find
          </button>
        </div>
      </div>

      {/* Meeting Types */}
      <div className="mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">Recovery Programs</h3>
        <div className="space-y-3">
          {MEETING_TYPES.map((type, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedType(expandedType === i ? null : i)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: type.color + '22' }}
                >
                  <Users className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{type.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{type.description}</p>
                </div>
              </button>

              {expandedType === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {type.types.map((t, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSearch(type.website)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Find {type.name.split(' ')[0]} Meetings
                  </button>

                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Phone className="w-3.5 h-3.5" />
                    {type.phone}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Online Meetings */}
      <div className="mb-6">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-400" />
          24/7 Online Meetings
        </h3>
        <div className="space-y-2">
          {ONLINE_PLATFORMS.map((platform, i) => (
            <button
              key={i}
              onClick={() => window.open(platform.url, '_blank')}
              className="w-full bg-gray-900 border border-gray-800 hover:border-emerald-500/50 rounded-xl p-3 flex items-center justify-between gap-3 transition-all text-left"
            >
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{platform.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{platform.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-400" />
          <h3 className="text-blue-300 font-semibold text-sm">First Time at a Meeting?</h3>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            <span><strong>Open meetings</strong> welcome anyone, including supporters</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            <span><strong>Closed meetings</strong> are for people in recovery only</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            <span>You don't have to speak if you don't want to</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            <span>Everything shared in meetings is confidential</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">•</span>
            <span>Try different meetings to find what works for you</span>
          </li>
        </ul>
      </div>

      {/* Emergency */}
      <div className="bg-red-900/20 border border-red-700/30 rounded-2xl p-4">
        <h3 className="text-red-300 font-semibold text-sm mb-2">In Crisis?</h3>
        <div className="space-y-2 text-sm">
          <a
            href="tel:988"
            className="flex items-center gap-2 text-white hover:text-red-300 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span><strong>988</strong> - Suicide & Crisis Lifeline</span>
          </a>
          <a
            href="tel:1-800-662-4357"
            className="flex items-center gap-2 text-white hover:text-red-300 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span><strong>1-800-662-HELP</strong> - SAMHSA National Helpline</span>
          </a>
        </div>
      </div>
    </div>
  );
}
