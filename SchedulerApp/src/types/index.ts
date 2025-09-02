export type Schedule = {
  id?: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  categoryId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  isCompleted?: boolean;
  repeat?: string;
  repeatEndDate?: string | null;
  alarmEnabled?: boolean;
  alarmTime?: string | null;
  // 반복 일정 관련 새 필드들
  repeatGroupId?: string;
  isRecurring?: boolean;
  originalRepeat?: string;
  originalRepeatEndDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type PriorityOption = {
  label: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
};

export type RepeatOption = {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
};

export type PriorityOptions = Record<string, PriorityOption>;
export type RepeatOptions = Record<string, RepeatOption>;

export type ViewMode = 'daily' | 'weekly' | 'monthly';
