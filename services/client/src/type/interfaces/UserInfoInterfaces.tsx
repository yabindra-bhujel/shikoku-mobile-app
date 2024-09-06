
export interface SkillSchemaInterface {
    id: number;
    name: string;
  }
  
  export interface InterestSchemaInterface {
    id: number;
    name: string;
  }
  
  export interface ClubActivitySchemaInterface {
    id: number;
    name: string;
  }
  
export interface UserInfoInterface {
    user_id: number;
    skills?: SkillSchemaInterface[];
    interests?: InterestSchemaInterface[];
    club_activities?: ClubActivitySchemaInterface[];
  }