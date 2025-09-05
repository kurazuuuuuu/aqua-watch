// 博多区周辺のデモ投稿データ
const demoPosts = [
  {
    id: 1,
    title: "博多駅前の水質調査",
    description: "博多駅前の水路の水質を調査しました。透明度は良好ですが、若干の濁りが見られます。",
    latitude: 33.5904,
    longitude: 130.4017,
    image_path: null,
    nickname: "環境調査員A",
    created_at: "2025-09-01T10:30:00Z",
    water_quality_score: 75
  },
  {
    id: 2,
    title: "那珂川河口付近",
    description: "那珂川の河口付近で水質測定を実施。塩分濃度の影響で若干の変化が見られます。",
    latitude: 33.5851,
    longitude: 130.3947,
    image_path: null,
    nickname: "市民ボランティアB",
    created_at: "2025-09-02T14:15:00Z",
    water_quality_score: 68
  },
  {
    id: 3,
    title: "キャナルシティ周辺",
    description: "キャナルシティ博多周辺の水路調査。都市部のため水質に注意が必要です。",
    latitude: 33.5898,
    longitude: 130.4115,
    image_path: null,
    nickname: "学生調査団C",
    created_at: "2025-09-03T09:45:00Z",
    water_quality_score: 62
  },
  {
    id: 4,
    title: "博多港湾エリア",
    description: "博多港の水質調査結果。海水の影響で塩分濃度が高めですが、透明度は良好です。",
    latitude: 33.6089,
    longitude: 130.3928,
    image_path: null,
    nickname: "海洋研究者D",
    created_at: "2025-09-04T16:20:00Z",
    water_quality_score: 71
  },
  {
    id: 5,
    title: "住吉神社付近の水路",
    description: "住吉神社周辺の小さな水路で測定。住宅地のため生活排水の影響が懸念されます。",
    latitude: 33.5926,
    longitude: 130.4089,
    image_path: null,
    nickname: "地域住民E",
    created_at: "2025-09-05T08:10:00Z",
    water_quality_score: 58
  },
  {
    id: 6,
    title: "中洲エリア水質調査",
    description: "中洲の川沿いで水質測定。繁華街のため水質管理に注意が必要な地域です。",
    latitude: 33.5935,
    longitude: 130.4067,
    image_path: null,
    nickname: "NPO団体F",
    created_at: "2025-08-30T12:30:00Z",
    water_quality_score: 55
  },
  {
    id: 7,
    title: "東公園池の水質",
    description: "東公園内の池で水質調査を実施。自然環境が保たれており、比較的良好な結果です。",
    latitude: 33.5967,
    longitude: 130.4156,
    image_path: null,
    nickname: "公園管理者G",
    created_at: "2025-08-28T15:45:00Z",
    water_quality_score: 82
  },
  {
    id: 8,
    title: "博多川上流部",
    description: "博多川の上流部での測定結果。上流のため比較的清浄ですが、都市化の影響も見られます。",
    latitude: 33.6012,
    longitude: 130.4201,
    image_path: null,
    nickname: "河川調査員H",
    created_at: "2025-08-25T11:20:00Z",
    water_quality_score: 78
  },
  {
    id: 9,
    title: "承天寺通り雨水排水口",
    description: "承天寺通りの雨水排水口周辺を調査。雨後の水質変化が顕著に見られました。",
    latitude: 33.5889,
    longitude: 130.4045,
    image_path: null,
    nickname: "都市環境研究者I",
    created_at: "2025-08-22T07:30:00Z",
    water_quality_score: 64
  },
  {
    id: 10,
    title: "博多リバレイン前",
    description: "博多リバレイン前の那珂川で測定。観光地のため定期的な監視が重要です。",
    latitude: 33.5912,
    longitude: 130.4001,
    image_path: null,
    nickname: "観光協会職員J",
    created_at: "2025-08-20T13:15:00Z",
    water_quality_score: 73
  },
  {
    id: 11,
    title: "祇園駅周辺水路",
    description: "祇園駅周辺の小規模水路を調査。地下鉄工事の影響で一時的に濁りが発生。",
    latitude: 33.5943,
    longitude: 130.4123,
    image_path: null,
    nickname: "交通局環境課K",
    created_at: "2025-08-18T11:00:00Z",
    water_quality_score: 59
  },
  {
    id: 12,
    title: "冷泉公園池",
    description: "冷泉公園の池で水質測定。都市公園としては良好な水質を維持しています。",
    latitude: 33.5958,
    longitude: 130.4078,
    image_path: null,
    nickname: "公園愛護会L",
    created_at: "2025-08-15T16:45:00Z",
    water_quality_score: 79
  },
  {
    id: 13,
    title: "博多駅南口排水路",
    description: "博多駅南口の排水路を調査。駅周辺の開発に伴う水質への影響を監視中。",
    latitude: 33.5876,
    longitude: 130.4021,
    image_path: null,
    nickname: "JR九州環境部M",
    created_at: "2025-08-12T09:20:00Z",
    water_quality_score: 66
  },
  {
    id: 14,
    title: "石堂川合流点",
    description: "石堂川と那珂川の合流点で測定。複数の水系が混合する重要な監視ポイントです。",
    latitude: 33.5823,
    longitude: 130.3912,
    image_path: null,
    nickname: "河川管理事務所N",
    created_at: "2025-08-10T14:30:00Z",
    water_quality_score: 70
  },
  {
    id: 15,
    title: "博多座裏手水路",
    description: "博多座裏手の水路調査。劇場街のため排水管理に特に注意を払っています。",
    latitude: 33.5921,
    longitude: 130.4056,
    image_path: null,
    nickname: "文化施設管理者O",
    created_at: "2025-08-08T18:00:00Z",
    water_quality_score: 61
  },
  {
    id: 16,
    title: "櫛田神社境内池",
    description: "櫛田神社境内の池で水質調査。歴史ある神社の池として良好な状態を保持。",
    latitude: 33.5952,
    longitude: 130.4089,
    image_path: null,
    nickname: "神社関係者P",
    created_at: "2025-08-05T10:15:00Z",
    water_quality_score: 85
  },
  {
    id: 17,
    title: "博多駅東口調整池",
    description: "博多駅東口の雨水調整池を調査。都市型洪水対策施設としての水質管理。",
    latitude: 33.5918,
    longitude: 130.4067,
    image_path: null,
    nickname: "防災課職員Q",
    created_at: "2025-08-03T08:45:00Z",
    water_quality_score: 67
  },
  {
    id: 18,
    title: "はかた駅前通り地下水",
    description: "はかた駅前通りの地下水調査。地下街開発による地下水への影響を調査。",
    latitude: 33.5895,
    longitude: 130.4034,
    image_path: null,
    nickname: "地質調査員R",
    created_at: "2025-08-01T12:00:00Z",
    water_quality_score: 72
  },
  {
    id: 19,
    title: "博多千年門周辺",
    description: "博多千年門周辺の水路で測定。観光地としての景観と水質の両立を目指しています。",
    latitude: 33.5934,
    longitude: 130.4098,
    image_path: null,
    nickname: "観光ガイドS",
    created_at: "2025-07-29T15:30:00Z",
    water_quality_score: 76
  },
  {
    id: 20,
    title: "博多駅筑紫口噴水",
    description: "博多駅筑紫口の噴水設備で水質チェック。循環システムの効果を確認しました。",
    latitude: 33.5891,
    longitude: 130.4008,
    image_path: null,
    nickname: "設備管理者T",
    created_at: "2025-07-27T11:45:00Z",
    water_quality_score: 88
  }
];

module.exports = demoPosts;
