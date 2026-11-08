import source from "./sampleReportResponse.json";
import { toReportView } from "../utils/reportMapper";
import reporter from "../assets/images/introduction/sample-reporter.png";
import giver from "../assets/images/introduction/sample-giver.png";

// 제공받은 보고서의 수치와 내용을 사용하고 표시 이름만 변경합니다.
const report = toReportView(source);
Object.assign(report.speakers.me.character, { imageUrl: giver, titleColor: "#b29271", background: "linear-gradient(158deg, #fff 42%, #e4ba93 90%)" });
Object.assign(report.speakers.partner.character, { imageUrl: reporter, titleColor: "#6b7185", background: "linear-gradient(158deg, #fff 42%, #bac1db 90%)" });
export const sampleReport = report;
