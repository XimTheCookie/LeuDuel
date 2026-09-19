export interface YgoCard {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  scale?: number;
  card_images: { id: number; image_url_small: string }[];
  misc_info?: { konami_id?: number }[];
}
