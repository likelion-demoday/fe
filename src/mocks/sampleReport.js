import { mockAnalysisReportResponse } from "./analysisReportResponse";
import { buildMockReportExtras } from "./reportExtras";
import { toReportView } from "../utils/reportMapper";
import reporter from "../assets/images/introduction/sample-reporter.png";
import giver from "../assets/images/introduction/sample-giver.png";

// 소개 체험용 데이터. 실제 보고서와 개발용 목데이터에는 영향을 주지 않습니다.
const source = structuredClone(mockAnalysisReportResponse.report);
source.recordingInfo.speakers = [
  { speakerRole: "SELF", speakerName: "지우" },
  { speakerRole: "PARTNER", speakerName: "민서" },
];
source.quantitativeAnalysis.speakers = [
  { speakerRole: "SELF", speakingDurationMs: 946550, utteranceCount: 96, speakingRatioPercent: 55, averageUtteranceDurationMs: 9860, syllablesPerSecond: 5.6 },
  { speakerRole: "PARTNER", speakingDurationMs: 774450, utteranceCount: 86, speakingRatioPercent: 45, averageUtteranceDurationMs: 9005, syllablesPerSecond: 5.0 },
];
const qualitative = source.qualitativeAnalysis;
Object.assign(qualitative, buildMockReportExtras("FRIEND_DAILY"));
qualitative.overview = {
  title: "꼼꼼히 묻는 사람 × 다정히 챙기는 사람",
  description: "지우님은 구체적인 질문으로 이야기를 정리하고, 민서님은 맞장구와 챙기는 말로 편안한 분위기를 만들어요.",
};
qualitative.characterInsights = [
  { speakerRole: "SELF", name: "팩트체크 기자", description: "궁금한 건 꼼꼼히 확인하고 구체적으로 질문해요" },
  { speakerRole: "PARTNER", name: "그니까 집착러", description: "상대의 말에 공감하고 다정하게 마음을 챙겨요" },
];
qualitative.interestInsights[0].score = 82;
qualitative.interestInsights[0].description = "대화의 55%를 말하면서도 후속 질문과 감정 질문으로 상대의 이야기를 꼼꼼히 확인했어요.";
qualitative.interestInsights[1].score = 76;
qualitative.interestInsights[1].description = "맞장구와 챙기는 말을 통해 상대의 이야기에 관심을 보여줬어요.";
qualitative.spicinessInsights[0].score = 24;
qualitative.spicinessInsights[0].swearWordCount = 1;
qualitative.spicinessInsights[0].description = "질문과 의견은 분명하지만 강한 표현을 줄여 부드럽게 말했어요.";
qualitative.spicinessInsights[0].observations = [
  { category: "SWEAR_WORD", title: "비속어", description: "가벼운 비속어가 한 번 등장했어요." },
  { category: "DIRECTNESS", title: "직설력", description: "사실을 확인하는 질문을 명확하게 건넸어요." },
];
qualitative.spicinessInsights[1].score = 12;
qualitative.reactionStyleInsights[0].thinkingPercent = 78;
qualitative.reactionStyleInsights[0].feelingPercent = 22;
qualitative.reactionStyleInsights[1].thinkingPercent = 18;
qualitative.reactionStyleInsights[1].feelingPercent = 82;
qualitative.representativeEvidences = [];
qualitative.reactionStyleInsights[0].examples = [
  { category: "THINKING", title: "기차는 몇 시에 출발하는지 확인했어?", description: "" },
  { category: "FEELING", title: "준비하느라 힘들었겠다. 고생했어!", description: "" },
];
qualitative.reactionStyleInsights[1].examples = [
  { category: "FEELING", title: "그니까, 많이 기대됐겠다! 나도 같이 가고 싶어.", description: "" },
  { category: "THINKING", title: "그럼 예약부터 해두면 되겠다.", description: "" },
];
const report = toReportView(source);
Object.assign(report.speakers.me.character, { imageUrl: reporter, titleColor: "#6b7185", background: "linear-gradient(158deg, #fff 42%, #bac1db 90%)" });
Object.assign(report.speakers.partner.character, { imageUrl: giver, titleColor: "#b29271", background: "linear-gradient(158deg, #fff 42%, #e4ba93 90%)" });
export const sampleReport = report;
