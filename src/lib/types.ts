export interface Book {
  id?: string;
  title: string;
  author: string;
  authorBio?: string;
  oneLiner: string;
  whyReadThisToday?: string;
  genreTags: string[];
  difficulty: string;
  summaryParagraph?: string;
  overviewBullets: string[];
  whoItsFor: string[];
  // Add other fields if necessary based on API response
  lastCharacterAvatar?: string;
  lastCharacter?: string;
}

export interface Character {
  id?: string;
  name: string;
  role: string;
  styleTag: string;
  intro: string;
  avatar?: string;
}

export interface Message {
  role: 'character' | 'user';
  content: string;
  id?: string;
  timestamp?: number;
}
