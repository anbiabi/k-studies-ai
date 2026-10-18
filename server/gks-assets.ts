export const GKS_OFFLINE_CONTEXT = `OFFLINE OFFICIAL GKS CONTEXT (maintained in assets/gks/official-sources.md; last reviewed 2026-10-18)
Authority order: current NIIED/Study in Korea recruitment guideline, current Study in Korea notice, relevant Korean Embassy/Consulate, designated university, then older material only for comparison.

GKS is a Korean government scholarship for international students. Support may include Korean-language training, degree study, tuition, airfare, medical insurance, and allowances; exact benefits are year-specific.
Applicants normally use one route: Embassy Track through the Korean diplomatic mission in the country of citizenship, or University Track directly through a designated university. Use one route only and follow the current year's guideline.
General undergraduate baselines include non-Korean citizenship for the applicant and both parents, the applicable age limit, required prior education, and the current academic-performance threshold. General graduate baselines include non-Korean citizenship for the applicant and both parents, the applicable age limit, the required prior degree, and the current academic-performance threshold. These are not guarantees.
Common documents may include the application form, personal statement, study plan, recommendation letter(s), graduation or expected-graduation proof, official transcripts, citizenship/family-relation proof, and supporting tests or awards where applicable. The current guideline controls mandatory documents, translations, certification/apostille, copies, and deadlines.
Embassies and universities conduct first screening for their own tracks. Do not invent current deadlines, quotas, university lists, embassy procedures, or document rules.

OFFICIAL REFERENCES
2026 GKS-G notice: https://www.studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4420
2026 overview: https://www.studyinkorea.go.kr/ko/plan/scholarship.do?tab=gks-tab2
2027 GKS-U notice: https://www.studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4522
The 2026 GKS-G notice lists revised guidelines, forms, general university information parts 1–3, and specialization information. The 2027 GKS-U notice lists English/Korean guidelines, forms, Embassy Track Type A/B university information, and University Track information.
For Cameroon, verify country-specific instructions with the current Korean Embassy in Cameroon notice in addition to NIIED guidance.`;

export const getOfflineGksAnswer = (question: string) => {
  const normalized = question.toLowerCase();
  if (normalized.includes("embassy") || normalized.includes("university track") || normalized.includes("track")) {
    return "GKS normally has Embassy Track (apply through the Korean diplomatic mission in your country of citizenship) and University Track (apply directly to a designated university). Use one route only. The current year's NIIED guideline and the receiving embassy or university decide the exact process, quota, and university choices. For Cameroon-specific steps, verify the current Korean Embassy in Cameroon notice.";
  }
  if (normalized.includes("document") || normalized.includes("paper") || normalized.includes("apostille") || normalized.includes("transcript")) {
    return "Common GKS materials may include the application form, personal statement, study plan, recommendation letter(s), graduation or expected-graduation proof, official transcripts, and citizenship/family-relation proof. The current year's guideline decides what is mandatory, how documents must be translated or certified, and the deadline. See the official source register in assets/gks/official-sources.md.";
  }
  if (normalized.includes("gpa") || normalized.includes("age") || normalized.includes("eligible") || normalized.includes("requirement")) {
    return "General GKS eligibility includes the applicable citizenship, age, education, and academic-performance rules, but the exact thresholds are year- and program-specific. Check the current NIIED recruitment guideline before deciding. The official offline sources are listed in assets/gks/official-sources.md.";
  }
  return "I could not reach the live AI service, so I am using the local official GKS source library. Please check the current NIIED recruitment notice and the relevant Korean Embassy or designated university for the exact answer, especially for deadlines, quotas, documents, and country-specific procedures.";
};
