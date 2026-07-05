export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  plan: string;
  referralCode: string;
  referralCount: number;
  createdAt: string;
}

export interface UserStatsDTO {
  totalReferrals: number;
  // d'autres stats futures (CV, Entretiens)
}
