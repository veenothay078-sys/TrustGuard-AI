/**
 * TrustGuard RAG Knowledge Base
 * Cybersecurity & Scam Awareness Knowledge Documents
 *
 * Used to retrieve relevant guidance to augment AI explanations
 */

const knowledgeBase = [
  {
    id: 'kb-001',
    title: 'Phishing Attack Patterns',
    category: 'Phishing Risk',
    tags: ['phishing', 'email', 'link', 'credential', 'login', 'fake website'],
    content: `Phishing attacks impersonate legitimate organizations to steal credentials or personal data. Common indicators include: urgency to act immediately, requests for passwords or OTPs, links that don't match the claimed sender, poor grammar, generic greetings ("Dear Customer"), mismatched domains, and threats of account suspension. Never click links in unsolicited emails. Always navigate to websites directly.`
  },
  {
    id: 'kb-002',
    title: 'Financial Fraud & Payment Scams',
    category: 'Financial Fraud Risk',
    tags: ['payment', 'bank transfer', 'wire', 'gift card', 'cryptocurrency', 'fraud'],
    content: `Payment scams request urgent fund transfers via untraceable methods like cryptocurrency, gift cards, or wire transfers. Legitimate businesses and government agencies will never ask for gift cards as payment. Red flags: urgent payment demands, threats if payment not made immediately, requests to pay via unusual methods, promises of large returns for small upfront payments.`
  },
  {
    id: 'kb-003',
    title: 'Identity Theft Prevention',
    category: 'Identity Theft Risk',
    tags: ['identity', 'personal information', 'ssn', 'id', 'aadhaar', 'passport', 'social security'],
    content: `Identity theft occurs when fraudsters obtain your personal information to impersonate you or access your accounts. Never share: Social Security Number, Aadhaar number, passport details, driver's license number, date of birth, or mother's maiden name through unverified channels. Verify any request for personal information by contacting the organization directly through official channels.`
  },
  {
    id: 'kb-004',
    title: 'Prize & Lottery Scam Indicators',
    category: 'Prize/Reward Scam',
    tags: ['prize', 'lottery', 'winner', 'reward', 'congratulations', 'selected', 'jackpot'],
    content: `Prize scams claim you've won a lottery or prize you didn't enter. Common tactics: "You've been selected!", upfront fees required to claim prize, personal information requests, urgency to respond quickly. Legitimate lotteries do not require winners to pay fees upfront. If you didn't enter a contest, you cannot have won it.`
  },
  {
    id: 'kb-005',
    title: 'Investment Scam Red Flags',
    category: 'Investment Scam',
    tags: ['investment', 'returns', 'profit', 'trading', 'cryptocurrency', 'forex', 'guaranteed'],
    content: `Investment scams promise unrealistically high returns with little or no risk. Warning signs: guaranteed returns, pressure to invest immediately, unregistered investments, complex strategies explained vaguely, requests to recruit others (Ponzi/pyramid structure). All investments carry risk — any guarantee is a major red flag. Check if the firm is registered with official financial regulators.`
  },
  {
    id: 'kb-006',
    title: 'Account Takeover Prevention',
    category: 'Account Takeover Risk',
    tags: ['otp', 'two-factor', '2fa', 'password', 'account', 'verification', 'login'],
    content: `Account takeover attacks attempt to gain control of your accounts. Never share OTPs, verification codes, or temporary passwords with anyone — even people claiming to be from customer support. Legitimate services will never ask for your OTP over phone or message. Enable two-factor authentication and use unique, strong passwords for each account.`
  },
  {
    id: 'kb-007',
    title: 'Social Engineering Tactics',
    category: 'Social Engineering Risk',
    tags: ['social engineering', 'urgency', 'authority', 'fear', 'manipulation', 'trust'],
    content: `Social engineering manipulates people psychologically rather than exploiting technical vulnerabilities. Common tactics: creating urgency or fear, impersonating authority figures (police, banks, government), building false trust, using personal information to appear legitimate. Slow down and think critically when feeling pressured to act quickly on financial or security matters.`
  },
  {
    id: 'kb-008',
    title: 'Suspicious URL & Website Detection',
    category: 'Malicious Link Risk',
    tags: ['url', 'domain', 'website', 'link', 'phishing', 'fake', 'lookalike'],
    content: `Fraudulent websites often use: misspelled domain names (gooogle.com, paypa1.com), excessive subdomains (login.bank.legitimate.suspiciousdomain.com), HTTP instead of HTTPS, URL shorteners to hide true destination, free hosting domains (.tk, .ml, .xyz). Always check the full URL before entering credentials. Look for the padlock icon but remember it only indicates encryption, not legitimacy.`
  },
  {
    id: 'kb-009',
    title: 'Digital Payment Safety',
    category: 'Payment Scam',
    tags: ['upi', 'payment', 'digital', 'transfer', 'wallet', 'bank', 'transaction'],
    content: `Digital payment safety guidelines: Never share UPI PIN, ATM PIN, or CVV with anyone. Verify recipient details before transferring money. Be suspicious of "collect money" requests — these can look like payment requests. Legitimate merchants never need your PIN to receive payment. Check if the amount you're paying matches what you expect before confirming. Keep transaction records.`
  },
  {
    id: 'kb-010',
    title: 'Impersonation Scam Awareness',
    category: 'Impersonation Scam',
    tags: ['impersonation', 'amazon', 'microsoft', 'google', 'bank', 'government', 'fake'],
    content: `Scammers impersonate trusted brands and institutions. Common impersonation targets: Amazon, Microsoft, Google, Apple, PayPal, local banks, tax authorities, police, and government agencies. Red flags: unsolicited contact, requests for payment or credentials, threats and urgency. Always verify by visiting the official website directly or calling the official customer service number.`
  },
  {
    id: 'kb-011',
    title: 'Tech Support Scam Prevention',
    category: 'Impersonation Scam',
    tags: ['tech support', 'microsoft', 'computer', 'virus', 'remote access', 'call'],
    content: `Tech support scams claim your device has a virus or problem and offer to fix it for a fee or remote access. Microsoft, Apple, and Google will never call you unsolicited about device problems. Never allow remote access to your device to someone who contacted you first. Fake virus alerts in browsers are common — close the browser and run a real scan.`
  },
  {
    id: 'kb-012',
    title: 'Email Security & Spam Recognition',
    category: 'Phishing Risk',
    tags: ['email', 'spam', 'phishing', 'attachment', 'link', 'sender'],
    content: `Suspicious email indicators: mismatched sender address (display name vs. actual email), generic greetings, requests for urgent action, unexpected attachments, links with mismatched hover text, requests for personal or financial information. Check email headers for spoofing. Use spam filters and report phishing emails to your provider.`
  },
  {
    id: 'kb-013',
    title: 'Online Shopping Scam Indicators',
    category: 'Financial Fraud Risk',
    tags: ['shopping', 'online', 'fake', 'product', 'seller', 'payment', 'ecommerce'],
    content: `Online shopping scam indicators: prices that seem too good to be true, requests for bank transfer or gift card payment, sellers with no reviews or suspicious reviews, websites with no return policy or contact information, pressure to buy immediately. Shop only on established platforms with buyer protection. Use credit cards for online purchases when possible.`
  },
  {
    id: 'kb-014',
    title: 'Credential Safety Best Practices',
    category: 'Account Takeover Risk',
    tags: ['password', 'credential', 'security', 'account', 'login', 'authentication'],
    content: `Credential safety: Use unique passwords for each service. Use a password manager. Enable multi-factor authentication wherever available. Never reuse passwords from breached services. Check HaveIBeenPwned.com to see if your email has been in data breaches. Be suspicious of sites asking for credentials without HTTPS. Log out from shared devices.`
  },
  {
    id: 'kb-015',
    title: 'Romance & Relationship Scam Patterns',
    category: 'Social Engineering Risk',
    tags: ['romance', 'relationship', 'love', 'dating', 'money', 'foreign'],
    content: `Romance scams build emotional relationships online before requesting money. Warning signs: quick emotional attachment, refusal to video call or meet, claims of being abroad and in trouble, requests for money for emergencies (medical, travel, legal). Never send money to someone you haven't met in person, regardless of how long you've communicated online.`
  },
  {
    id: 'kb-016',
    title: 'Malware & Ransomware Prevention',
    category: 'Malicious Link Risk',
    tags: ['malware', 'ransomware', 'virus', 'download', 'attachment', 'software'],
    content: `Malware is often delivered through phishing emails with malicious attachments, drive-by downloads from compromised websites, fake software updates, and USB drives. Prevention: Keep systems updated, use antivirus software, don't open unexpected attachments, download software only from official sources, back up important data regularly.`
  },
  {
    id: 'kb-017',
    title: 'Job Offer & Employment Scam Red Flags',
    category: 'Financial Fraud Risk',
    tags: ['job', 'employment', 'offer', 'work from home', 'salary', 'recruitment'],
    content: `Job scams offer attractive positions requiring little qualification or upfront payment. Red flags: requests for payment for training or equipment, salaries far above market rate, vague job descriptions, requests for bank account details before employment, offers from unsolicited contacts. Verify any job offer through official company channels.`
  },
  {
    id: 'kb-018',
    title: 'Suspicious SMS & WhatsApp Messages',
    category: 'Phishing Risk',
    tags: ['sms', 'whatsapp', 'message', 'text', 'link', 'bank', 'delivery'],
    content: `Smishing (SMS phishing) sends fraudulent texts appearing to be from banks, delivery services, or government agencies. Common tricks: fake package delivery notifications, account verification requests, OTP reset messages. Never click links in unsolicited texts. Contact the sender through official channels to verify any message requesting action.`
  },
  {
    id: 'kb-019',
    title: 'Advance Fee Fraud (419 Scam)',
    category: 'Financial Fraud Risk',
    tags: ['advance fee', 'nigerian', '419', 'inheritance', 'lawyer', 'transfer'],
    content: `Advance fee fraud promises large sums of money in exchange for help with a transaction, inheritance, or transfer. The victim is asked to pay "fees" upfront, which keep increasing. No large payment ever arrives. Red flags: unsolicited contact, stories of large trapped funds, requests for fees or legal charges. Legitimate windfalls don't require upfront fees.`
  },
  {
    id: 'kb-020',
    title: 'QR Code Scam Prevention',
    category: 'Payment Scam',
    tags: ['qr code', 'scan', 'payment', 'collect', 'camera'],
    content: `QR code scams use fraudulent QR codes to redirect victims to phishing sites or initiate unauthorized payments. Risks: tampered QR codes in public places, QR codes sent via messages asking you to "collect" money (which actually makes you pay), malicious website links hidden in QR codes. Verify QR code sources before scanning. In payment apps, a QR scan should never ask for your PIN to receive money.`
  },
  {
    id: 'kb-021',
    title: 'Suspicious Advertisement Detection',
    category: 'Suspicious Advertisement',
    tags: ['advertisement', 'ad', 'popup', 'offer', 'click', 'redirect'],
    content: `Malicious advertisements (malvertising) can install malware, redirect to phishing pages, or promote scam products. Warning signs: impossible claims ("Earn $5000/day!"), fake celebrity endorsements, countdown timers, pop-ups claiming you've won something, ads for unverified financial products. Use an ad blocker and avoid clicking on suspicious advertisements.`
  },
  {
    id: 'kb-022',
    title: 'General Online Safety Guidelines',
    category: 'Other Suspicious Activity',
    tags: ['safety', 'online', 'general', 'protection', 'security'],
    content: `General online safety principles: Think before clicking. Verify before acting. If it seems too good to be true, it probably is. Never share passwords, OTPs, or PINs. Use official websites and verified contact numbers. Report suspicious activity to relevant authorities. Keep software and antivirus updated. Regularly monitor financial accounts for unauthorized transactions.`
  }
];

/**
 * Retrieve relevant knowledge documents based on categories and text
 * Uses keyword overlap for relevance scoring
 */
function retrieveRelevantDocs(categories = [], inputText = '', maxDocs = 3) {
  const lowerInput = inputText.toLowerCase();
  const lowerCategories = categories.map(c => c.toLowerCase());

  const scored = knowledgeBase.map(doc => {
    let score = 0;

    // Category match
    if (lowerCategories.some(cat => doc.category.toLowerCase().includes(cat.split(' ')[0]))) {
      score += 50;
    }

    // Tag overlap with input text
    const tagHits = doc.tags.filter(tag => lowerInput.includes(tag)).length;
    score += tagHits * 10;

    // Tag overlap with categories
    const catTagHits = doc.tags.filter(tag =>
      lowerCategories.some(cat => cat.includes(tag) || tag.includes(cat.split(' ')[0]))
    ).length;
    score += catTagHits * 15;

    return { doc, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxDocs)
    .map(s => ({
      id: s.doc.id,
      title: s.doc.title,
      category: s.doc.category,
      relevantContent: s.doc.content,
      relevanceScore: s.score
    }));
}

module.exports = { knowledgeBase, retrieveRelevantDocs };
