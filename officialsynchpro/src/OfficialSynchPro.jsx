import React, { useState } from 'react';
import { Calendar, Users, BookOpen, Trophy, Video, FileText, MessageSquare, ChevronRight, Clock, MapPin, Star, ClipboardList, UserPlus, Lock, Upload, Download, Bell, Map, ExternalLink, Pin, Award, CheckCircle, AlertTriangle, X } from 'lucide-react';

const OfficialSynchPro = () => {
  const [userRole, setUserRole] = useState('guest');
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState(null);
  const [selectedGameForEval, setSelectedGameForEval] = useState(null);
  const [currentClinicianName, setCurrentClinicianName] = useState('Sarah Mitchell'); // Default clinician name

  // Admin Accounts
  const [adminAccounts] = useState([
    {
      id: 1,
      name: 'Jeff Gotto',
      email: 'jgotto54@gmail.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 2,
      name: 'Craig Erds',
      email: 'erds24@gmail.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 3,
      name: 'Chris Packer',
      email: 'chrispacker2@gmail.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 4,
      name: 'Jacob Finn',
      email: 'herbfinn@hotmail.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 5,
      name: 'Arnold Archuleta',
      email: 'arnold.archuleta@gmail.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 6,
      name: 'Jodie Heo',
      email: 'jodiebeth512@gmail.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 7,
      name: 'Karli Jelden',
      email: 'karli_jelden@yahoo.com',
      role: 'admin',
      password: 'admin123'
    }
  ]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadgeCamper, setSelectedBadgeCamper] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [draggedCamper, setDraggedCamper] = useState(null);
  const [dragOverCamper, setDragOverCamper] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [headshotPreview, setHeadshotPreview] = useState(null);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Welcome to Camp!",
      message: "Check-in begins at 8:00 AM on June 4th. Please arrive 30 minutes early.",
      date: "2026-06-01",
      sender: "Camp Director",
      read: false,
      campId: null
    },
    {
      id: 2,
      title: "VH1 Camp Update",
      message: "Don't forget to bring your resume and whistle. Locker rooms open at 7:30 AM.",
      date: "2026-06-10",
      sender: "Verne Harris",
      read: false,
      campId: 'college-2'
    }
  ]);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    campId: null,
    sessionId: null,
    sendEmail: true
  });

  const [selectedCampForAnnouncement, setSelectedCampForAnnouncement] = useState(null);

  const unreadCount = announcements.filter(a => !a.read).length;

  const markAsRead = (announcementId) => {
    setAnnouncements(announcements.map(a => 
      a.id === announcementId ? {...a, read: true} : a
    ));
  };

  const sendAnnouncement = () => {
    const announcement = {
      id: announcements.length + 1,
      ...newAnnouncement,
      date: new Date().toISOString().split('T')[0],
      sender: 'Admin',
      read: false
    };

    setAnnouncements([...announcements, announcement]);

    if (newAnnouncement.sendEmail) {
      let targetDescription;
      if (newAnnouncement.sessionId) {
        const camp = availableCamps.find(c => c.id === newAnnouncement.campId);
        const session = camp?.sessions.find(s => s.id === newAnnouncement.sessionId);
        targetDescription = `${camp?.name} - ${session?.name}`;
      } else if (newAnnouncement.campId) {
        const camp = availableCamps.find(c => c.id === newAnnouncement.campId);
        targetDescription = camp?.name;
      } else {
        targetDescription = 'All Camps';
      }
      
      alert(`📧 Email sent to all campers in ${targetDescription}:\n\nSubject: New Announcement - ${newAnnouncement.title}\n\nYou have a new message in your OfficialSynch Pro inbox. Log in to view: https://officialsynchpro.com/inbox`);
    }

    setNewAnnouncement({ title: '', message: '', campId: null, sessionId: null, sendEmail: true });
    setSelectedCampForAnnouncement(null);
    setShowAnnouncementModal(false);
  };

  // Scheduling Configuration
  const [scheduleConfig, setScheduleConfig] = useState({
    maxGamesPerDay: 3,
    preventBackToBack: true,
    gameDuration: 60 // minutes
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [newGame, setNewGame] = useState({
    date: '',
    time: '',
    court: 'A',
    homeTeam: '',
    awayTeam: '',
    crew: [],
    evaluators: [],
    duration: 60,
    status: 'scheduled'
  });

  const availableCourts = ['A', 'B', 'C', 'D'];
  const officialPositions = ['Referee', 'Umpire 1', 'Umpire 2', 'Alternate'];
  const availableEvaluators = ['Sarah Mitchell', 'Marcus Chen', 'Jennifer Lopez', 'David Wang'];

  const vh1Logo = 'vh1-logo.png'; // Place this file in same directory as the React app

  const availableCamps = [
    {
      id: 'college-1',
      type: 'college',
      name: 'Colorado Collegiate Officials College Camp',
      dates: 'June 4-5, 2026',
      location: 'University of Northern Colorado, Greeley, CO',
      capacity: 40,
      enrolled: 32,
      description: 'Elite training for college basketball officials',
      logo: null,
      sessions: [
        { id: 'college-1-session-1', name: 'Day 1 - Morning Session', date: 'June 4, 9:00 AM' },
        { id: 'college-1-session-2', name: 'Day 1 - Afternoon Session', date: 'June 4, 2:00 PM' },
        { id: 'college-1-session-3', name: 'Day 2 - Morning Session', date: 'June 5, 9:00 AM' },
        { id: 'college-1-session-4', name: 'Day 2 - Afternoon Session', date: 'June 5, 2:00 PM' }
      ]
    },
    {
      id: 'college-2',
      type: 'college',
      name: 'VH1 Basketball Officials Camp',
      dates: 'June 18-20, 2026',
      location: 'Gold Crown Field House (150 S. Harlan, Lakewood, CO)',
      capacity: 90,
      enrolled: 28,
      description: 'Verne Harris and The Gold Crown Foundation would like to invite you to the 2026 VH1 Basketball Officials Camp. This instructional/tryout camp is open to current high school varsity officials with 3 plus years of experience and all college level officials. Camp is limited to 90 campers and is an opportunity to get hired as part of the RMAC Division 2 Mens Basketball Officials Staff. As a camp participant you will: Receive a camp gift. Have at least 2 games videotaped. Receive feedback as part of video breakdown with camp clinicians. Receive valuable information and instruction in daily classroom sessions. Boys Varsity Basketball. Questions contact Arnold Archuleta 303-250-8678 arnold.archuleta@gmail.com. Verne Harris - Camp Director | RMAC Coordinator of Mens Basketball Officials.',
      logo: vh1Logo,
      sessions: [
        { id: 'college-2-session-1', name: 'Day 1 - On-Court Session', date: 'June 18, 9:00 AM' },
        { id: 'college-2-session-2', name: 'Day 1 - Film Review', date: 'June 18, 2:00 PM' },
        { id: 'college-2-session-3', name: 'Day 2 - On-Court Session', date: 'June 19, 9:00 AM' },
        { id: 'college-2-session-4', name: 'Day 2 - Film Review', date: 'June 19, 2:00 PM' },
        { id: 'college-2-session-5', name: 'Day 3 - Evaluation Games', date: 'June 20, 9:00 AM' },
        { id: 'college-2-session-6', name: 'Day 3 - Final Feedback', date: 'June 20, 2:00 PM' }
      ]
    },
    {
      id: 'hs-1',
      type: 'highschool',
      name: 'Colorado Collegiate Officials High School Camp',
      dates: 'June 4-6, 2026',
      location: 'University of Northern Colorado, Greeley, CO',
      capacity: 60,
      enrolled: 38,
      description: 'Comprehensive training for high school officials',
      logo: null,
      sessions: [
        { id: 'hs-1-session-1', name: 'Day 1 - Fundamentals', date: 'June 4, 9:00 AM' },
        { id: 'hs-1-session-2', name: 'Day 1 - Game Management', date: 'June 4, 2:00 PM' },
        { id: 'hs-1-session-3', name: 'Day 2 - Advanced Mechanics', date: 'June 5, 9:00 AM' },
        { id: 'hs-1-session-4', name: 'Day 2 - Scrimmages', date: 'June 5, 2:00 PM' },
        { id: 'hs-1-session-5', name: 'Day 3 - Evaluation', date: 'June 6, 9:00 AM' }
      ]
    }
  ];

  const availableBadges = [
    { id: 'mechanics_master', name: 'Mechanics Master', emoji: '🎯', color: 'from-yellow-400 to-orange-500' },
    { id: 'rule_expert', name: 'Rule Expert', emoji: '📚', color: 'from-green-400 to-emerald-500' },
    { id: 'game_manager', name: 'Game Manager', emoji: '🎮', color: 'from-purple-400 to-pink-500' },
    { id: 'team_player', name: 'Team Player', emoji: '🤝', color: 'from-blue-400 to-cyan-500' },
    { id: 'rising_star', name: 'Rising Star', emoji: '⭐', color: 'from-red-400 to-orange-500' },
    { id: 'perfect_attendance', name: 'Perfect Attendance', emoji: '✅', color: 'from-indigo-400 to-purple-500' }
  ];

  const [campers, setCampers] = useState([
    { id: 1, name: "Alex Thompson", level: "5 years", games: 3, avgRating: 4.5, headshot: null, badges: [], rank: 1 },
    { id: 2, name: "Jordan Mitchell", level: "3 years", games: 5, avgRating: 4.2, headshot: null, badges: ['mechanics_master'], rank: 2 },
    { id: 3, name: "Casey Reynolds", level: "7 years", games: 2, avgRating: 4.8, headshot: null, badges: [], rank: 3 },
    { id: 4, name: "Morgan Davis", level: "2 years", games: 4, avgRating: 3.9, headshot: null, badges: ['rising_star'], rank: 4 },
    { id: 5, name: "Riley Parker", level: "4 years", games: 3, avgRating: 4.3, headshot: null, badges: [], rank: 5 },
    { id: 6, name: "Taylor Brooks", level: "6 years", games: 4, avgRating: 4.6, headshot: null, badges: ['team_player'], rank: 6 }
  ]);

  const [games, setGames] = useState([
    { 
      id: 1, 
      date: "2026-06-15", 
      time: "9:00 AM", 
      court: "A", 
      homeTeam: "Red Squad", 
      awayTeam: "Blue Squad", 
      crew: [
        { id: 1, name: "Alex Thompson", position: "Referee" },
        { id: 2, name: "Jordan Mitchell", position: "Umpire 1" },
        { id: 3, name: "Casey Reynolds", position: "Umpire 2" }
      ],
      status: "scheduled",
      evaluator: "Sarah Mitchell"
    },
    { 
      id: 2, 
      date: "2026-06-15", 
      time: "10:30 AM", 
      court: "B", 
      homeTeam: "Green Team", 
      awayTeam: "Yellow Team", 
      crew: [
        { id: 4, name: "Morgan Davis", position: "Referee" },
        { id: 5, name: "Riley Parker", position: "Umpire 1" },
        { id: 6, name: "Taylor Brooks", position: "Umpire 2" }
      ],
      status: "scheduled",
      evaluator: "Marcus Chen"
    },
    { 
      id: 3, 
      date: "2026-06-15", 
      time: "1:00 PM", 
      court: "A", 
      homeTeam: "White Squad", 
      awayTeam: "Black Squad", 
      crew: [
        { id: 3, name: "Casey Reynolds", position: "Referee" },
        { id: 4, name: "Morgan Davis", position: "Umpire 1" },
        { id: 1, name: "Alex Thompson", position: "Umpire 2" }
      ],
      status: "scheduled",
      evaluator: "Sarah Mitchell"
    },
    { 
      id: 4, 
      date: "2026-06-15", 
      time: "2:30 PM", 
      court: "B", 
      homeTeam: "Purple Team", 
      awayTeam: "Orange Team", 
      crew: [
        { id: 2, name: "Jordan Mitchell", position: "Referee" },
        { id: 6, name: "Taylor Brooks", position: "Umpire 1" },
        { id: 5, name: "Riley Parker", position: "Umpire 2" }
      ],
      status: "scheduled",
      evaluator: "Marcus Chen"
    }
  ]);

  const [evaluations, setEvaluations] = useState({});
  const [feedbackData, setFeedbackData] = useState({
    judgment_decision: 5,
    game_management: 5,
    positioning_mechanics: 5,
    communication_crew: 5,
    court_presence: 5,
    rules_knowledge: 5,
    notes: ''
  });

  const evaluationCategories = [
    { key: 'judgment_decision', label: 'Judgment & Decision Quality', weight: 25 },
    { key: 'game_management', label: 'Game Management', weight: 20 },
    { key: 'positioning_mechanics', label: 'Positioning & Mechanics', weight: 20 },
    { key: 'communication_crew', label: 'Communication & Crew Work', weight: 15 },
    { key: 'court_presence', label: 'Court Presence & Professionalism', weight: 10 },
    { key: 'rules_knowledge', label: 'Rules Knowledge & Situational Awareness', weight: 10 }
  ];

  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    campSelection: '',
    experience: '',
    headshot: null,
    paymentConfirmation: null,
    paymentStatus: 'pending',
    isRMACStaff: false
  });

  const [registrationStep, setRegistrationStep] = useState(1); // 1: Info, 2: Payment
  const [paymentProof, setPaymentProof] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [selectedVH1Tier, setSelectedVH1Tier] = useState('nonstaff');

  const campFees = {
    'college-1': 200,
    'college-2': { rmac: 350, nonstaff: 450 }, // VH1 has two tiers
    'hs-1': 125
  };

  const getVH1Price = (isRMAC) => isRMAC ? campFees['college-2'].rmac : campFees['college-2'].nonstaff;

  const venmoUsername = 'OfficialSynchPro'; // Replace with your actual Venmo username

  const handleSSOLogin = (provider) => {
    // Simulate SSO authentication - in production this would call actual OAuth
    const ssoUserData = {
      firstName: provider === 'Google' ? 'John' : 'Jane',
      lastName: provider === 'Google' ? 'Doe' : 'Smith',
      email: provider === 'Google' ? 'john.doe@gmail.com' : 'jane.smith@outlook.com'
    };

    // Pre-fill registration data with SSO info
    setRegistrationData({
      ...registrationData,
      firstName: ssoUserData.firstName,
      lastName: ssoUserData.lastName,
      email: ssoUserData.email,
      password: 'sso-authenticated' // Mark as SSO user
    });

    // Show success message
    alert(`✓ Authenticated with ${provider}\n\nPlease complete your camp registration below.`);
    
    // Don't auto-login yet - they need to complete registration first
  };

  const handleHeadshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadshotPreview(reader.result);
        setRegistrationData({...registrationData, headshot: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result);
        setRegistrationData({...registrationData, paymentConfirmation: reader.result, paymentStatus: 'submitted'});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumePreview(file.name);
      setRegistrationData({...registrationData, resume: file.name});
    }
  };

  const openVenmo = (campId) => {
    let fee;
    if (campId === 'college-2') {
      // VH1 camp with two price tiers
      fee = selectedVH1Tier === 'rmac' ? campFees[campId].rmac : campFees[campId].nonstaff;
    } else {
      fee = campFees[campId];
    }
    
    const camp = availableCamps.find(c => c.id === campId);
    const note = `Registration: ${camp?.name}`;
    
    // Venmo deep link format
    const venmoUrl = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${fee}&note=${encodeURIComponent(note)}`;
    
    // Try to open Venmo app, fallback to web
    window.location.href = venmoUrl;
    
    // Fallback to web after a short delay if app doesn't open
    setTimeout(() => {
      window.open(`https://venmo.com/${venmoUsername}?txn=pay&amount=${fee}&note=${encodeURIComponent(note)}`, '_blank');
    }, 1000);
  };

  const handleDragStart = (e, camper) => {
    setDraggedCamper(camper);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, camper) => {
    e.preventDefault();
    setDragOverCamper(camper);
  };

  const handleDragLeave = () => {
    setDragOverCamper(null);
  };

  const handleDrop = (e, targetCamper) => {
    e.preventDefault();
    if (!draggedCamper || draggedCamper.id === targetCamper.id) return;

    const newCampers = [...campers];
    const draggedIndex = newCampers.findIndex(c => c.id === draggedCamper.id);
    const targetIndex = newCampers.findIndex(c => c.id === targetCamper.id);

    newCampers.splice(draggedIndex, 1);
    newCampers.splice(targetIndex, 0, draggedCamper);

    newCampers.forEach((camper, index) => {
      camper.rank = index + 1;
    });

    setCampers(newCampers);
    setDraggedCamper(null);
    setDragOverCamper(null);
  };

  const detectConflicts = (game) => {
    const conflicts = [];
    games.forEach(g => {
      if (g.id !== game.id && g.time === game.time && g.date === game.date) {
        const sharedCrew = g.crew.filter(gc => 
          game.crew.some(gameCrew => gameCrew.id === gc.id)
        );
        if (sharedCrew.length > 0) {
          conflicts.push({ game: g, officials: sharedCrew });
        }
      }
    });
    return conflicts;
  };

  const submitEvaluation = () => {
    if (!selectedCamper) return;
    
    const newEvaluation = {
      ...feedbackData,
      date: new Date().toLocaleDateString(),
      evaluator: currentClinicianName,
      gameId: selectedGameForEval?.id,
      gameInfo: selectedGameForEval ? `${selectedGameForEval.homeTeam} vs ${selectedGameForEval.awayTeam} - ${selectedGameForEval.date} ${selectedGameForEval.time}` : null
    };

    setEvaluations({
      ...evaluations,
      [selectedCamper.id]: [...(evaluations[selectedCamper.id] || []), newEvaluation]
    });

    setFeedbackData({
      judgment_decision: 5,
      game_management: 5,
      positioning_mechanics: 5,
      communication_crew: 5,
      court_presence: 5,
      rules_knowledge: 5,
      notes: ''
    });
    setShowFeedbackModal(false);
    setSelectedCamper(null);
    setSelectedGameForEval(null);
  };

  const awardBadge = (badgeId) => {
    if (!selectedBadgeCamper) return;
    
    const updatedCampers = campers.map(c => {
      if (c.id === selectedBadgeCamper.id) {
        // Allow multiple instances of the same badge
        return { ...c, badges: [...c.badges, badgeId] };
      }
      return c;
    });
    
    setCampers(updatedCampers);
    setShowBadgeModal(false);
    setSelectedBadgeCamper(null);
  };

  // Helper function to count badge instances
  const getBadgeCounts = (badges) => {
    const counts = {};
    badges.forEach(badgeId => {
      counts[badgeId] = (counts[badgeId] || 0) + 1;
    });
    return counts;
  };

  // Smart Scheduling Functions
  const getOfficialGamesOnDate = (officialId, date) => {
    return games.filter(game => 
      game.date === date && 
      game.crew.some(c => c.id === officialId)
    );
  };

  const checkBackToBack = (game, officialId) => {
    if (!scheduleConfig.preventBackToBack) return null;
    
    const gameTime = new Date(`${game.date} ${game.time}`);
    const gameEnd = new Date(gameTime.getTime() + game.duration * 60000);
    
    return games.find(g => {
      if (g.id === game.id || !g.crew.some(c => c.id === officialId)) return false;
      
      const gTime = new Date(`${g.date} ${g.time}`);
      const gEnd = new Date(gTime.getTime() + (g.duration || scheduleConfig.gameDuration) * 60000);
      
      // Check if games overlap or are back-to-back
      return (gameTime >= gTime && gameTime < gEnd) || 
             (gameEnd > gTime && gameEnd <= gEnd) ||
             (gameTime.getTime() === gEnd.getTime()) ||
             (gTime.getTime() === gameEnd.getTime());
    });
  };

  const validateGameSchedule = (game) => {
    const warnings = [];
    
    // Check each official
    game.crew.forEach(official => {
      if (!official.id) return;
      
      // Check daily game limit
      const gamesOnDate = getOfficialGamesOnDate(official.id, game.date);
      if (gamesOnDate.length >= scheduleConfig.maxGamesPerDay) {
        warnings.push({
          type: 'daily_limit',
          official: official.name,
          message: `${official.name} already has ${gamesOnDate.length} games on ${game.date} (limit: ${scheduleConfig.maxGamesPerDay})`
        });
      }
      
      // Check back-to-back
      const backToBackGame = checkBackToBack(game, official.id);
      if (backToBackGame) {
        warnings.push({
          type: 'back_to_back',
          official: official.name,
          message: `${official.name} has a back-to-back game at ${backToBackGame.time} on Court ${backToBackGame.court}`
        });
      }
    });
    
    return warnings;
  };

  const saveGame = () => {
    if (!newGame.date || !newGame.time || !newGame.homeTeam || !newGame.awayTeam) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (newGame.crew.length < 3) {
      alert('Please assign at least 3 officials (Referee, Umpire 1, Umpire 2)');
      return;
    }
    
    if (newGame.evaluators.length === 0) {
      alert('Please assign at least one evaluator');
      return;
    }
    
    const warnings = validateGameSchedule(newGame);
    if (warnings.length > 0 && !confirm(`Warning:\n${warnings.map(w => w.message).join('\n')}\n\nContinue anyway?`)) {
      return;
    }
    
    if (editingGame) {
      // Update existing game
      setGames(games.map(g => g.id === editingGame.id ? { ...newGame, id: editingGame.id } : g));
    } else {
      // Create new game
      const gameWithId = {
        ...newGame,
        id: games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1,
        evaluator: newGame.evaluators[0] // Primary evaluator
      };
      setGames([...games, gameWithId]);
    }
    
    setShowScheduleModal(false);
    setEditingGame(null);
    setNewGame({
      date: '',
      time: '',
      court: 'A',
      homeTeam: '',
      awayTeam: '',
      crew: [],
      evaluators: [],
      duration: scheduleConfig.gameDuration,
      status: 'scheduled'
    });
  };

  const addOfficialToCrew = (position) => {
    if (newGame.crew.length >= 4) {
      alert('Maximum 4 officials per game');
      return;
    }
    setNewGame({
      ...newGame,
      crew: [...newGame.crew, { id: null, name: '', position }]
    });
  };

  const updateCrewMember = (index, officialId) => {
    const camper = campers.find(c => c.id === parseInt(officialId));
    if (!camper) return;
    
    const updatedCrew = [...newGame.crew];
    updatedCrew[index] = { ...updatedCrew[index], id: camper.id, name: camper.name };
    setNewGame({ ...newGame, crew: updatedCrew });
  };

  const removeCrewMember = (index) => {
    setNewGame({
      ...newGame,
      crew: newGame.crew.filter((_, i) => i !== index)
    });
  };

  const handleAdminLogin = () => {
    const admin = adminAccounts.find(
      acc => acc.email.toLowerCase() === loginEmail.toLowerCase() && acc.password === loginPassword
    );

    if (admin) {
      setUserRole('admin');
      setCurrentClinicianName(admin.name);
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
      alert(`Welcome back, ${admin.name}!`);
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const RegistrationModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full my-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-br from-slate-900 to-slate-800 z-10 pb-4">
            <h2 className="text-3xl font-bold text-white">
              {registrationStep === 1 ? 'Register for Camp' : 'Payment'}
            </h2>
            <button onClick={() => {
              setShowRegistration(false);
              setRegistrationStep(1);
              setPaymentProof(null);
              setResumePreview(null);
              setHeadshotPreview(null);
            }} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${registrationStep >= 1 ? 'bg-blue-600' : 'bg-white/10'} text-white font-semibold`}>
              1
            </div>
            <div className={`h-1 w-16 ${registrationStep >= 2 ? 'bg-blue-600' : 'bg-white/10'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${registrationStep >= 2 ? 'bg-blue-600' : 'bg-white/10'} text-white font-semibold`}>
              2
            </div>
          </div>

          {registrationStep === 1 ? (
            <>
              <div className="space-y-6 mb-8">
                <button
                  onClick={() => handleSSOLogin('Google')}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSSOLogin('Microsoft')}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900 text-gray-400">Or register manually</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {registrationData.password === 'sso-authenticated' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Authenticated via SSO</span>
                  </div>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  disabled={registrationData.password === 'sso-authenticated'}
                />

                {registrationData.password !== 'sso-authenticated' && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                )}

                <select
                  value={registrationData.campSelection}
                  onChange={(e) => setRegistrationData({...registrationData, campSelection: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ background: '#1e293b', color: '#fff' }}>Select Camp</option>
                  <optgroup label="College Camps" style={{ background: '#1e293b', color: '#94a3b8' }}>
                    {availableCamps.filter(c => c.type === 'college').map(camp => (
                      <option key={camp.id} value={camp.id} style={{ background: '#1e293b', color: '#fff' }}>
                        {camp.id === 'college-2' 
                          ? `${camp.name} - RMAC Staff $${campFees[camp.id].rmac} / Non-Staff $${campFees[camp.id].nonstaff}`
                          : `${camp.name} - $${campFees[camp.id]}`
                        }
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="High School Camps" style={{ background: '#1e293b', color: '#94a3b8' }}>
                    {availableCamps.filter(c => c.type === 'highschool').map(camp => (
                      <option key={camp.id} value={camp.id} style={{ background: '#1e293b', color: '#fff' }}>
                        {camp.name} - ${campFees[camp.id]}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* VH1 Price Tier Selection */}
                {registrationData.campSelection === 'college-2' && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <label className="block text-white font-semibold mb-3">Select Your Price Tier</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="vh1tier"
                          value="rmac"
                          checked={selectedVH1Tier === 'rmac'}
                          onChange={(e) => setSelectedVH1Tier(e.target.value)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="text-white font-semibold">Current RMAC Staff - $350</div>
                          <div className="text-gray-400 text-sm">For currently active RMAC officials</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="vh1tier"
                          value="nonstaff"
                          checked={selectedVH1Tier === 'nonstaff'}
                          onChange={(e) => setSelectedVH1Tier(e.target.value)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="text-white font-semibold">Non-Staff - $450</div>
                          <div className="text-gray-400 text-sm">For all other officials</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <select
                  value={registrationData.experience}
                  onChange={(e) => setRegistrationData({...registrationData, experience: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ background: '#1e293b', color: '#fff' }}>Experience Level</option>
                  <option value="0-2 years" style={{ background: '#1e293b', color: '#fff' }}>0-2 years</option>
                  <option value="3-5 years" style={{ background: '#1e293b', color: '#fff' }}>3-5 years</option>
                  <option value="6-10 years" style={{ background: '#1e293b', color: '#fff' }}>6-10 years</option>
                  <option value="10+ years" style={{ background: '#1e293b', color: '#fff' }}>10+ years</option>
                </select>

                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeadshotUpload}
                    className="hidden"
                    id="headshot-upload"
                  />
                  <label htmlFor="headshot-upload" className="cursor-pointer">
                    {headshotPreview ? (
                      <img src={headshotPreview} alt="Headshot" className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-gray-400 text-sm">Upload Headshot (Optional)</p>
                  </label>
                </div>

                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {resumePreview ? (
                      <>
                        <FileText className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 text-sm font-semibold">{resumePreview}</p>
                      </>
                    ) : (
                      <>
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Upload Resume (Optional)</p>
                        <p className="text-gray-500 text-xs mt-1">PDF, DOC, or DOCX</p>
                      </>
                    )}
                  </label>
                </div>

                <button
                  onClick={() => {
                    if (!registrationData.campSelection) {
                      alert('Please select a camp');
                      return;
                    }
                    setRegistrationStep(2);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-gray-400 text-sm mb-2">Registration Fee</div>
                    <div className="text-4xl font-bold text-white mb-2">
                      ${registrationData.campSelection === 'college-2' 
                        ? (selectedVH1Tier === 'rmac' ? campFees[registrationData.campSelection].rmac : campFees[registrationData.campSelection].nonstaff)
                        : campFees[registrationData.campSelection]}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {availableCamps.find(c => c.id === registrationData.campSelection)?.name}
                    </div>
                    {registrationData.campSelection === 'college-2' && (
                      <div className="text-blue-400 text-sm mt-1">
                        {selectedVH1Tier === 'rmac' ? 'Current RMAC Staff' : 'Non-Staff'}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openVenmo(registrationData.campSelection)}
                    className="w-full bg-[#008CFF] hover:bg-[#0074CC] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.75 2c1.26 0 2.25.99 2.25 2.25v15.5c0 1.26-.99 2.25-2.25 2.25H3.25C1.99 22 1 21.01 1 19.75V4.25C1 2.99 1.99 2 3.25 2h11.5zm-1.47 3.5c-.42-.02-.83.07-1.2.24-.37.17-.68.42-.92.73-.24.31-.4.67-.47 1.06-.07.39-.05.79.06 1.16l2.76 9.26h2.37l3.68-11.8c-.61.83-1.39 1.5-2.28 1.97-.89.47-1.88.72-2.9.72-.37 0-.73-.05-1.1-.14z"/>
                    </svg>
                    Pay with Venmo
                  </button>

                  <div className="text-center text-xs text-gray-500 mt-2">
                    Opens Venmo app or web
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800 text-gray-400">After payment</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <label className="block text-white font-semibold mb-4">
                    Upload Payment Confirmation
                  </label>
                  <p className="text-sm text-gray-400 mb-4">
                    Take a screenshot of your Venmo payment confirmation and upload it here
                  </p>
                  
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentProofUpload}
                      className="hidden"
                      id="payment-proof-upload"
                    />
                    <label htmlFor="payment-proof-upload" className="cursor-pointer">
                      {paymentProof ? (
                        <>
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                          <p className="text-green-400 font-semibold">Payment proof uploaded!</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Click to upload screenshot</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setRegistrationStep(1)}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!paymentProof) {
                        alert('Please upload payment confirmation');
                        return;
                      }
                      const newCamper = {
                        id: campers.length + 1,
                        name: `${registrationData.firstName} ${registrationData.lastName}`,
                        level: registrationData.experience,
                        games: 0,
                        avgRating: 0,
                        headshot: registrationData.headshot,
                        badges: [],
                        rank: campers.length + 1,
                        paymentStatus: 'submitted'
                      };
                      setCampers([...campers, newCamper]);
                      setUserRole('camper');
                      setShowRegistration(false);
                      setRegistrationStep(1);
                      setPaymentProof(null);
                      alert('Registration submitted! Payment pending admin verification.');
                    }}
                    disabled={!paymentProof}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Registration
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Your registration will be confirmed once payment is verified by our team
                  </p>
                  {registrationData.password === 'sso-authenticated' && (
                    <p className="text-xs text-blue-400 mt-2">
                      ✓ You can log in anytime using the same SSO method (Google/Microsoft)
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const CampSelectionView = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-12">Select Your Camp</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">College Camps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {availableCamps.filter(c => c.type === 'college').map(camp => (
            <div key={camp.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {camp.logo && (
                    <img src={camp.logo} alt={`${camp.name} logo`} className="w-16 h-16 rounded-lg object-contain bg-white/10 p-2" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{camp.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {camp.dates}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {camp.location}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                  College
                </span>
              </div>
              
              <p className="text-gray-400 mb-4">{camp.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Enrollment</span>
                  <span>{camp.enrolled} / {camp.capacity}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${(camp.enrolled / camp.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedCamp(camp)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Camp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">High School Camps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {availableCamps.filter(c => c.type === 'highschool').map(camp => (
            <div key={camp.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {camp.logo && (
                    <img src={camp.logo} alt={`${camp.name} logo`} className="w-16 h-16 rounded-lg object-contain bg-white/10 p-2" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{camp.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {camp.dates}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {camp.location}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                  High School
                </span>
              </div>
              
              <p className="text-gray-400 mb-4">{camp.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Enrollment</span>
                  <span>{camp.enrolled} / {camp.capacity}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${(camp.enrolled / camp.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedCamp(camp)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Camp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EvaluationModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full my-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Evaluate: {selectedCamper?.name}</h2>
              {selectedGameForEval && (
                <p className="text-sm text-gray-400 mt-1">
                  Game {selectedGameForEval.id} • {selectedGameForEval.homeTeam} vs {selectedGameForEval.awayTeam} • {selectedGameForEval.date} @ {selectedGameForEval.time} • Court {selectedGameForEval.court}
                </p>
              )}
            </div>
            <button onClick={() => { 
              setShowFeedbackModal(false); 
              setSelectedCamper(null);
              setSelectedGameForEval(null);
            }} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {evaluationCategories.map(category => (
              <div key={category.key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white font-medium">
                    {category.label}
                  </label>
                  <span className="text-blue-400 font-semibold text-sm">{category.weight}%</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackData({...feedbackData, [category.key]: rating})}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${rating <= feedbackData[category.key] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <label className="block text-white font-medium mb-2">Feedback Notes</label>
              <textarea
                value={feedbackData.notes}
                onChange={(e) => setFeedbackData({...feedbackData, notes: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="Provide constructive feedback..."
              />
            </div>

            <button
              onClick={submitEvaluation}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all"
            >
              Submit Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminLoginModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
                setLoginEmail('');
                setLoginPassword('');
              }} 
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              onClick={handleAdminLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <div className="mb-2">All admin accounts use password: <span className="text-gray-400 font-semibold">admin123</span></div>
              <details className="cursor-pointer">
                <summary className="text-blue-400 hover:text-blue-300">View All Admin Emails</summary>
                <div className="mt-2 space-y-1 text-xs text-gray-400">
                  {adminAccounts.map(admin => (
                    <div key={admin.id}>{admin.email}</div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileModal = () => {
    if (!selectedProfile) return null;
    
    const badgeCounts = getBadgeCounts(selectedProfile.badges);
    const camperEvaluations = evaluations[selectedProfile.id] || [];
    
    // Calculate overall weighted average across all evaluations
    const overallAverage = camperEvaluations.length > 0 
      ? camperEvaluations.reduce((acc, eval) => {
          const weightedAvg = evaluationCategories.reduce((sum, cat) => {
            return sum + (eval[cat.key] || 0) * (cat.weight / 100);
          }, 0);
          return acc + weightedAvg;
        }, 0) / camperEvaluations.length
      : 0;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                {/* Profile Photo */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white/20">
                  {selectedProfile.headshot ? (
                    <img src={selectedProfile.headshot} alt={selectedProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {selectedProfile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedProfile.name}</h2>
                  <p className="text-gray-400">{selectedProfile.level} experience</p>
                  {camperEvaluations.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.round(overallAverage) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                        ))}
                      </div>
                      <span className="text-blue-400 font-semibold">{overallAverage.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">({camperEvaluations.length} evaluations)</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedProfile(null);
                }} 
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{selectedProfile.games || 0}</div>
                <div className="text-sm text-gray-400">Games Worked</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{Object.keys(badgeCounts).length}</div>
                <div className="text-sm text-gray-400">Badge Types</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{selectedProfile.badges.length}</div>
                <div className="text-sm text-gray-400">Total Badges</div>
              </div>
            </div>

            {/* Badges Earned */}
            {selectedProfile.badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Badges Earned</h3>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(badgeCounts).map(([badgeId, count]) => {
                    const badge = availableBadges.find(b => b.id === badgeId);
                    return badge ? (
                      <div key={badgeId} className={`relative bg-gradient-to-br ${badge.color} bg-opacity-20 border border-white/20 rounded-xl p-3 text-center`}>
                        <div className="text-3xl mb-1">{badge.emoji}</div>
                        <div className="text-white text-xs font-semibold">{badge.name}</div>
                        {count > 1 && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                            {count}x
                          </div>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Recent Evaluations - Only for Clinicians and Admins */}
            {(userRole === 'clinician' || userRole === 'admin') && camperEvaluations.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Recent Evaluations</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {camperEvaluations.slice(0, 5).map((eval, idx) => {
                    const weightedAvg = evaluationCategories.reduce((acc, cat) => {
                      return acc + (eval[cat.key] || 0) * (cat.weight / 100);
                    }, 0);
                    
                    return (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">{eval.gameInfo || 'Game evaluation'}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.round(weightedAvg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                              ))}
                            </div>
                            <span className="text-blue-400 text-sm font-semibold">{weightedAvg.toFixed(1)}</span>
                          </div>
                        </div>
                        {eval.notes && <p className="text-gray-300 text-sm mb-2">{eval.notes}</p>}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{eval.date}</span>
                          <span>by {eval.evaluator}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {camperEvaluations.length === 0 && (userRole === 'clinician' || userRole === 'admin') && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No evaluations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ScheduleGameModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-4xl w-full my-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingGame ? 'Edit Game' : 'Create New Game'}
            </h2>
            <button onClick={() => {
              setShowScheduleModal(false);
              setEditingGame(null);
              setNewGame({
                date: '',
                time: '',
                court: 'A',
                homeTeam: '',
                awayTeam: '',
                crew: [],
                evaluators: [],
                duration: scheduleConfig.gameDuration,
                status: 'scheduled'
              });
            }} className="text-gray-400 hover:text-white text-2xl">
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Game Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={newGame.date}
                  onChange={(e) => setNewGame({...newGame, date: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={newGame.time}
                  onChange={(e) => setNewGame({...newGame, time: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Court</label>
                <select
                  value={newGame.court}
                  onChange={(e) => setNewGame({...newGame, court: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  {availableCourts.map(court => (
                    <option key={court} value={court} style={{ background: '#1e293b', color: '#fff' }}>
                      Court {court}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newGame.duration}
                  onChange={(e) => setNewGame({...newGame, duration: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  min="30"
                  step="15"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Home Team</label>
                <input
                  type="text"
                  value={newGame.homeTeam}
                  onChange={(e) => setNewGame({...newGame, homeTeam: e.target.value})}
                  placeholder="Team name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Away Team</label>
                <input
                  type="text"
                  value={newGame.awayTeam}
                  onChange={(e) => setNewGame({...newGame, awayTeam: e.target.value})}
                  placeholder="Team name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Assign Officials */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Assign Officials (3-4)</h3>
                {newGame.crew.length < 4 && (
                  <div className="flex gap-2">
                    {officialPositions
                      .filter(pos => !newGame.crew.some(c => c.position === pos))
                      .map(position => (
                        <button
                          key={position}
                          onClick={() => addOfficialToCrew(position)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
                        >
                          + {position}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {newGame.crew.map((official, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-2">{official.position}</div>
                        <select
                          value={official.id || ''}
                          onChange={(e) => updateCrewMember(index, e.target.value)}
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="" style={{ background: '#1e293b', color: '#fff' }}>Select Official</option>
                          {campers.map(camper => (
                            <option key={camper.id} value={camper.id} style={{ background: '#1e293b', color: '#fff' }}>
                              {camper.name} ({camper.level})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => removeCrewMember(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Show warnings for this official */}
                    {official.id && newGame.date && newGame.time && (() => {
                      const warnings = validateGameSchedule(newGame).filter(w => w.official === official.name);
                      return warnings.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {warnings.map((warning, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{warning.message}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ))}

                {newGame.crew.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Click a position button above to start assigning officials
                  </div>
                )}
              </div>
            </div>

            {/* Assign Evaluators */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Assign Evaluators (1-2)</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {availableEvaluators.map(evaluator => (
                  <label key={evaluator} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-purple-500/50 transition-all">
                    <input
                      type="checkbox"
                      checked={newGame.evaluators.includes(evaluator)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (newGame.evaluators.length >= 2) {
                            alert('Maximum 2 evaluators per game');
                            return;
                          }
                          setNewGame({...newGame, evaluators: [...newGame.evaluators, evaluator]});
                        } else {
                          setNewGame({...newGame, evaluators: newGame.evaluators.filter(ev => ev !== evaluator)});
                        }
                      }}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-medium">{evaluator}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingGame(null);
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveGame}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all"
              >
                {editingGame ? 'Update Game' : 'Create Game'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BadgeModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full my-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Award Badge: {selectedBadgeCamper?.name}</h2>
            <button onClick={() => { setShowBadgeModal(false); setSelectedBadgeCamper(null); }} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {availableBadges.map(badge => (
              <button
                key={badge.id}
                onClick={() => awardBadge(badge.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedBadgeCamper?.badges.includes(badge.id)
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
              >
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <div className="text-white font-semibold">{badge.name}</div>
                {selectedBadgeCamper?.badges.includes(badge.id) && (
                  <div className="text-xs text-green-400 mt-1">Already Awarded</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {showRegistration && <RegistrationModal />}
      {showFeedbackModal && <EvaluationModal />}
      {showBadgeModal && <BadgeModal />}
      {showScheduleModal && <ScheduleGameModal />}
      {showProfileModal && <ProfileModal />}
      {showLoginModal && <AdminLoginModal />}

      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                🏀
              </div>
              <div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  OfficialSynch Pro
                </h1>
                {selectedCamp && (
                  <p className="text-xs text-gray-400">{selectedCamp.name}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {userRole === 'guest' && (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-purple-600 border border-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Admin Login
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('camper');
                      setSelectedCamp(availableCamps[0]); // Auto-select first camp
                      alert('Demo login successful! You can switch roles using the dropdown.');
                    }}
                    className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    Demo Login
                  </button>
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </>
              )}
              {userRole !== 'guest' && (
                <>
                  {selectedCamp && (
                    <button
                      onClick={() => setSelectedCamp(null)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      ← Back to Camps
                    </button>
                  )}
                  {userRole === 'admin' && (
                    <span className="text-sm text-gray-400">
                      Logged in as: <span className="text-white font-semibold">{currentClinicianName}</span>
                    </span>
                  )}
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="camper" style={{ background: '#1e293b', color: '#fff' }}>Camper View</option>
                    <option value="clinician" style={{ background: '#1e293b', color: '#fff' }}>Clinician View</option>
                    <option value="admin" style={{ background: '#1e293b', color: '#fff' }}>Admin View</option>
                  </select>
                  <button
                    onClick={() => {
                      setUserRole('guest');
                      setCurrentClinicianName('Sarah Mitchell');
                      alert('Logged out successfully');
                    }}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {userRole === 'guest' ? (
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50 animate-pulse"></div>
                  <h1 className="relative text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight leading-tight overflow-visible py-2">
                    OfficialSynch Pro
                  </h1>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-4">
                Elite Basketball Scheduling Software
              </p>
              <p className="text-xl text-gray-300 mb-8">
                Streamline your camp operations with intelligent scheduling and management
              </p>
              
              <button
                onClick={() => setShowRegistration(true)}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl text-xl font-bold overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <UserPlus className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Register Now</span>
                <ChevronRight className="w-6 h-6 relative z-10" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-20">
              {[
                { icon: Users, title: 'SSO Registration', desc: 'Quick login with Google or Microsoft' },
                { icon: Calendar, title: 'Game Scheduling', desc: 'Smart scheduling with conflict detection' },
                { icon: Trophy, title: 'Rankings & Badges', desc: 'Track progress and earn achievements' },
                { icon: Star, title: 'Evaluations', desc: 'Detailed feedback from expert clinicians' },
                { icon: Award, title: 'Achievement System', desc: 'Earn badges for excellence' },
                { icon: ClipboardList, title: 'Camp Selection', desc: 'Choose from college and high school camps' }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative text-center py-8 border-t border-white/10 mt-12">
            <p className="text-gray-400 text-sm">
              Developed by <span className="text-white font-semibold">MasterM1nd Strategies</span>
            </p>
          </div>
        </div>
      ) : !selectedCamp ? (
        <CampSelectionView />
      ) : (
        <>
          <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Trophy },
                  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : null },
                  ...(userRole === 'clinician' || userRole === 'admin' ? [{ id: 'rankings', label: 'Rankings', icon: Trophy }] : []),
                  { id: 'schedule', label: 'Schedule', icon: Calendar },
                  ...(userRole === 'clinician' || userRole === 'admin' ? [{ id: 'evaluations', label: 'Evaluations', icon: Star }] : []),
                  { id: 'badges', label: 'Badges', icon: Award },
                  ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: ClipboardList }] : [])
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {activeTab === 'overview' && (
              <div className="text-white text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Welcome to {selectedCamp.name}</h2>
                <p className="text-gray-400 mb-2">{selectedCamp.dates}</p>
                <p className="text-gray-400">{selectedCamp.location}</p>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Inbox</h2>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {announcements.length > 0 ? (
                    announcements.map(announcement => (
                      <div
                        key={announcement.id}
                        className={`bg-white/5 backdrop-blur-lg border rounded-xl p-5 cursor-pointer transition-all ${
                          !announcement.read 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        onClick={() => markAsRead(announcement.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {!announcement.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                          </div>
                          <div className="text-sm text-gray-400">{announcement.date}</div>
                        </div>
                        <p className="text-gray-300 mb-2">{announcement.message}</p>
                        <div className="text-sm text-gray-500">From: {announcement.sender}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rankings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">Camper Rankings</h2>
                  </div>
                  <div className="text-sm text-gray-400">
                    Drag and drop to reorder
                  </div>
                </div>

                <div className="space-y-2">
                  {[...campers].sort((a, b) => a.rank - b.rank).map((camper, index) => (
                    <div
                      key={camper.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, camper)}
                      onDragOver={(e) => handleDragOver(e, camper)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, camper)}
                      className={`bg-white/5 backdrop-blur-lg border rounded-xl p-6 cursor-move transition-all ${
                        draggedCamper?.id === camper.id
                          ? 'opacity-50 scale-95'
                          : dragOverCamper?.id === camper.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900'
                            : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white border-2 border-white/20'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>

                        <div className="flex-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProfile(camper);
                              setShowProfileModal(true);
                            }}
                            className="text-xl font-bold text-white mb-1 hover:text-blue-400 transition-colors"
                          >
                            {camper.name}
                          </button>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>{camper.level}</span>
                            <span>•</span>
                            <span>{camper.games} games</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              {camper.avgRating}
                            </span>
                          </div>
                          {camper.badges.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {camper.badges.map(badgeId => {
                                const badge = availableBadges.find(b => b.id === badgeId);
                                return badge ? (
                                  <span key={badgeId} className="text-lg" title={badge.name}>
                                    {badge.emoji}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>

                        <div className="text-gray-500 flex flex-col gap-1">
                          <div className="w-6 h-1 bg-gray-600 rounded"></div>
                          <div className="w-6 h-1 bg-gray-600 rounded"></div>
                          <div className="w-6 h-1 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Game Schedule</h2>
                </div>

                {games.map(game => {
                  const conflicts = detectConflicts(game);
                  return (
                    <div key={game.id} className={`bg-white/5 backdrop-blur-lg border rounded-xl p-6 ${conflicts.length > 0 ? 'border-red-500' : 'border-white/10'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-white font-semibold">{game.time}</span>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                            Court {game.court}
                          </span>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                          {game.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">Crew:</div>
                        <div className="flex flex-wrap gap-2">
                          {game.crew.map((official, idx) => {
                            const camper = campers.find(c => c.id === official.id);
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (camper) {
                                    setSelectedProfile(camper);
                                    setShowProfileModal(true);
                                  }
                                }}
                                className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 hover:border hover:border-blue-500 transition-all cursor-pointer"
                              >
                                {official.name} <span className="text-gray-400">({official.position})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-400">Evaluator: <span className="text-white font-semibold">{game.evaluator}</span></div>
                      </div>

                      {conflicts.length > 0 && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Scheduling Conflict Detected</span>
                          </div>
                          <div className="text-sm text-red-300">
                            {conflicts.map((conflict, idx) => (
                              <div key={idx}>
                                {conflict.officials.map(o => o.name).join(', ')} also assigned to Court {conflict.game.court} at {conflict.game.time}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'evaluations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">Game Evaluations</h2>
                  </div>
                  {userRole === 'clinician' && (
                    <span className="text-sm text-gray-400">
                      Assigned to: <span className="text-white font-semibold">{currentClinicianName}</span>
                    </span>
                  )}
                </div>

                {/* My Assigned Games */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    {userRole === 'admin' ? 'All Games' : 'My Assigned Games'}
                  </h3>
                  <div className="space-y-4">
                    {games
                      .filter(game => userRole === 'admin' || game.evaluator === currentClinicianName)
                      .map(game => (
                        <div key={game.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-white font-semibold">{game.date} @ {game.time}</span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                                  Court {game.court}
                                </span>
                              </div>
                              <div className="text-gray-300">
                                {game.homeTeam} vs {game.awayTeam}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">
                              Evaluator: <span className="text-white font-semibold">{game.evaluator}</span>
                            </div>
                          </div>

                          <div className="border-t border-white/10 pt-4">
                            <div className="text-sm text-gray-400 mb-3">Officials on this game:</div>
                            <div className="grid md:grid-cols-3 gap-3">
                              {game.crew.map(official => {
                                const camper = campers.find(c => c.id === official.id);
                                const hasEval = evaluations[official.id]?.some(e => e.gameId === game.id);
                                
                                return (
                                  <button
                                    key={official.id}
                                    onClick={() => {
                                      setSelectedCamper(camper);
                                      setSelectedGameForEval(game);
                                      setShowFeedbackModal(true);
                                    }}
                                    className={`bg-white/5 border rounded-xl p-4 text-left transition-all ${
                                      hasEval 
                                        ? 'border-green-500 bg-green-500/10' 
                                        : 'border-white/10 hover:border-blue-500/50'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <div className="text-white font-semibold">{official.name}</div>
                                        <div className="text-xs text-gray-400">{official.position}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProfile(camper);
                                            setShowProfileModal(true);
                                          }}
                                          className="text-blue-400 hover:text-blue-300 p-1"
                                          title="View Profile"
                                        >
                                          <Users className="w-4 h-4" />
                                        </button>
                                        {hasEval && (
                                          <CheckCircle className="w-5 h-5 text-green-400" />
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {camper?.level}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Recent Evaluations Summary */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Evaluations</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.entries(evaluations).flatMap(([camperId, evals]) =>
                      evals
                        .filter(eval => userRole === 'admin' || eval.evaluator === currentClinicianName)
                        .map((eval, idx) => {
                          const camper = campers.find(c => c.id === parseInt(camperId));
                          const weightedAvg = evaluationCategories.reduce((acc, cat) => {
                            return acc + (eval[cat.key] || 0) * (cat.weight / 100);
                          }, 0);
                          
                          return (
                            <div key={`${camperId}-${idx}`} className="border-b border-white/10 pb-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="text-white font-semibold">{camper?.name}</span>
                                  {eval.gameInfo && (
                                    <div className="text-xs text-gray-500 mt-1">{eval.gameInfo}</div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-400">Overall:</span>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 ${i < Math.round(weightedAvg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                                    ))}
                                  </div>
                                  <span className="text-blue-400 font-semibold ml-1">{weightedAvg.toFixed(1)}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                                {evaluationCategories.map(cat => (
                                  <div key={cat.key} className="text-gray-400">
                                    {cat.label.split('&')[0].trim()}: <span className="text-yellow-400">{eval[cat.key] || 0}/5</span>
                                  </div>
                                ))}
                              </div>
                              
                              {eval.notes && <p className="text-gray-400 text-sm mb-1">{eval.notes}</p>}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{eval.date}</span>
                                <span className="text-xs text-gray-500">by {eval.evaluator}</span>
                              </div>
                            </div>
                          );
                        })
                    )}
                    {Object.keys(evaluations).length === 0 && (
                      <p className="text-gray-500 text-center py-8">No evaluations yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <>
                {userRole === 'camper' ? (
                  // Camper Personal Badge View
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-white mb-2">My Badges</h2>
                      <p className="text-gray-400">Badges you've earned throughout camp</p>
                    </div>

                    {(() => {
                      // Get current camper (in real app, would use logged-in user ID)
                      const currentCamper = campers[0]; // Demo: using first camper
                      const badgeCounts = getBadgeCounts(currentCamper.badges);
                      const uniqueBadges = Object.keys(badgeCounts);

                      return uniqueBadges.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                          {uniqueBadges.map(badgeId => {
                            const badge = availableBadges.find(b => b.id === badgeId);
                            const count = badgeCounts[badgeId];
                            
                            return badge ? (
                              <div key={badgeId} className={`bg-gradient-to-br ${badge.color} bg-opacity-20 border-2 border-white/20 rounded-2xl p-6 text-center transform hover:scale-105 transition-all`}>
                                <div className="relative inline-block">
                                  <div className="text-6xl mb-3">{badge.emoji}</div>
                                  {count > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                      {count}x
                                    </div>
                                  )}
                                </div>
                                <div className="text-white font-bold text-lg mb-1">{badge.name}</div>
                                {count > 1 && (
                                  <div className="text-yellow-300 text-sm font-semibold">
                                    Earned {count} times!
                                  </div>
                                )}
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 text-lg mb-2">No badges yet</p>
                          <p className="text-gray-500 text-sm">Keep working hard and you'll earn badges from your evaluators!</p>
                        </div>
                      );
                    })()}

                    {/* Available Badges Reference */}
                    <div className="mt-12">
                      <h3 className="text-xl font-bold text-white mb-4 text-center">All Available Badges</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {availableBadges.map(badge => (
                          <div key={badge.id} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center opacity-60">
                            <div className="text-3xl mb-2">{badge.emoji}</div>
                            <div className="text-white text-sm">{badge.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Staff View: Award Badges
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Award Badge</h3>
                      
                      <div className="space-y-4">
                        {campers.map(camper => {
                          const badgeCounts = getBadgeCounts(camper.badges);
                          
                          return (
                            <button
                              key={camper.id}
                              onClick={() => {
                                setSelectedBadgeCamper(camper);
                                setShowBadgeModal(true);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:border-purple-500/50 transition-all"
                            >
                              <div className="text-white font-semibold mb-2">{camper.name}</div>
                              <div className="flex gap-2 flex-wrap">
                                {Object.entries(badgeCounts).map(([badgeId, count]) => {
                                  const badge = availableBadges.find(b => b.id === badgeId);
                                  return badge ? (
                                    <div key={badgeId} className="relative inline-block">
                                      <span className="text-xl" title={badge.name}>
                                        {badge.emoji}
                                      </span>
                                      {count > 1 && (
                                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                          {count}
                                        </span>
                                      )}
                                    </div>
                                  ) : null;
                                })}
                                {camper.badges.length === 0 && (
                                  <span className="text-sm text-gray-500">No badges yet</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Available Badges</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {availableBadges.map(badge => (
                          <div key={badge.id} className={`p-4 rounded-xl border border-white/10 bg-gradient-to-br ${badge.color} bg-opacity-10`}>
                            <div className="text-3xl mb-2">{badge.emoji}</div>
                            <div className="text-white font-semibold text-sm">{badge.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'admin' && userRole === 'admin' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                </div>

                {/* Schedule Management Section */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Schedule Management
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Max Games Per Official/Day
                      </label>
                      <input
                        type="number"
                        value={scheduleConfig.maxGamesPerDay}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, maxGamesPerDay: parseInt(e.target.value)})}
                        min="1"
                        max="10"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Default Game Duration (min)
                      </label>
                      <input
                        type="number"
                        value={scheduleConfig.gameDuration}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, gameDuration: parseInt(e.target.value)})}
                        min="30"
                        step="15"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Prevent Back-to-Back Games
                      </label>
                      <label className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduleConfig.preventBackToBack}
                          onChange={(e) => setScheduleConfig({...scheduleConfig, preventBackToBack: e.target.checked})}
                          className="w-5 h-5"
                        />
                        <span className="text-white">{scheduleConfig.preventBackToBack ? 'Enabled' : 'Disabled'}</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setNewGame({
                        ...newGame,
                        duration: scheduleConfig.gameDuration
                      });
                      setShowScheduleModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Create New Game
                  </button>
                </div>

                {/* Send Announcement Section */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    Send Announcement
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Announcement Title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                    
                    <textarea
                      placeholder="Message content..."
                      value={newAnnouncement.message}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                    
                    <select
                      value={newAnnouncement.campId || ''}
                      onChange={(e) => {
                        const campId = e.target.value || null;
                        setNewAnnouncement({...newAnnouncement, campId, sessionId: null});
                        setSelectedCampForAnnouncement(campId);
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ background: '#1e293b', color: '#fff' }}>All Camps</option>
                      {availableCamps.map(camp => (
                        <option key={camp.id} value={camp.id} style={{ background: '#1e293b', color: '#fff' }}>
                          {camp.name}
                        </option>
                      ))}
                    </select>

                    {newAnnouncement.campId && (
                      <select
                        value={newAnnouncement.sessionId || ''}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, sessionId: e.target.value || null})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" style={{ background: '#1e293b', color: '#fff' }}>All Sessions in This Camp</option>
                        {availableCamps.find(c => c.id === newAnnouncement.campId)?.sessions.map(session => (
                          <option key={session.id} value={session.id} style={{ background: '#1e293b', color: '#fff' }}>
                            {session.name} ({session.date})
                          </option>
                        ))}
                      </select>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAnnouncement.sendEmail}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, sendEmail: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-white">Send email notification to campers</span>
                    </label>

                    <button
                      onClick={sendAnnouncement}
                      disabled={!newAnnouncement.title || !newAnnouncement.message}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Send Announcement
                    </button>
                  </div>
                </div>

                {/* Pending Payments Section */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    Pending Payment Verifications
                  </h3>
                  
                  <div className="space-y-4">
                    {campers.filter(c => c.paymentStatus === 'submitted').length > 0 ? (
                      campers.filter(c => c.paymentStatus === 'submitted').map(camper => (
                        <div key={camper.id} className="bg-white/5 border border-yellow-500/30 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="text-white font-semibold text-lg">{camper.name}</div>
                              <div className="text-sm text-gray-400">{camper.level}</div>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                              Pending
                            </span>
                          </div>
                          
                          {camper.paymentConfirmation && (
                            <div className="mb-4">
                              <div className="text-sm text-gray-400 mb-2">Payment Proof:</div>
                              <img 
                                src={camper.paymentConfirmation} 
                                alt="Payment proof" 
                                className="max-w-xs rounded-lg border border-white/10"
                              />
                            </div>
                          )}
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                const updatedCampers = campers.map(c => 
                                  c.id === camper.id ? {...c, paymentStatus: 'verified'} : c
                                );
                                setCampers(updatedCampers);
                                alert(`Payment verified for ${camper.name}`);
                              }}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const updatedCampers = campers.map(c => 
                                  c.id === camper.id ? {...c, paymentStatus: 'rejected'} : c
                                );
                                setCampers(updatedCampers);
                                alert(`Payment rejected for ${camper.name}`);
                              }}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No pending payments
                      </div>
                    )}
                  </div>
                </div>

                {/* All Registrations */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">All Registrations</h3>
                  
                  <div className="space-y-3">
                    {campers.map(camper => (
                      <div key={camper.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {camper.headshot ? (
                              <img src={camper.headshot} alt={camper.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {camper.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                            <div>
                              <div className="text-white font-semibold">{camper.name}</div>
                              <div className="text-sm text-gray-400">{camper.level} • {camper.games} games</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              camper.paymentStatus === 'verified' 
                                ? 'bg-green-500/20 text-green-300' 
                                : camper.paymentStatus === 'submitted'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : camper.paymentStatus === 'rejected'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {camper.paymentStatus === 'verified' ? '✓ Verified' : 
                               camper.paymentStatus === 'submitted' ? '⏳ Pending' :
                               camper.paymentStatus === 'rejected' ? '✗ Rejected' : 'No Payment'}
                            </span>
                            
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${camper.name} from camp?`)) {
                                  setCampers(campers.filter(c => c.id !== camper.id));
                                }
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Camp Statistics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-2">Total Registrations</div>
                    <div className="text-3xl font-bold text-white">{campers.length}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-2">Verified Payments</div>
                    <div className="text-3xl font-bold text-green-400">
                      {campers.filter(c => c.paymentStatus === 'verified').length}
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-2">Pending Review</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {campers.filter(c => c.paymentStatus === 'submitted').length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OfficialSynchPro;