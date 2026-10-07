import { l, q } from './interview-questions-shared'
import type { InterviewQuestion } from './interview-questions-shared'

export const INTERVIEW_SOFT_QUESTIONS: InterviewQuestion[] = [
  q({
    id: 'self-intro',
    category: 'soft',
    tags: ['intro', 'senior'],
    question: l('Introduce yourself.', 'Giới thiệu bản thân.'),
    answer: l(
      `Keep it **60-90 seconds** and optimize for signal, not biography.

1. **Who you are now** - current role, ~5 years of FE, strongest stack: Vue 3 / Nuxt / TypeScript.
2. **What you have shipped** - domains, product types, team size, user impact.
3. **Why you are senior** - ownership, architecture decisions, debugging, mentoring, delivery under ambiguity.
4. **Why you are here** - connect your background to their product or their stack.

For Parker specifically, be honest that React is a growing area, not a production specialty. That is better than pretending. Frame it as: **strong FE fundamentals, proven production depth in Vue/Nuxt, actively transferring those skills into React/Next**.

End with a hook so the interviewer can choose the next topic: “Happy to go deeper into architecture, performance, or a recent project.”`,
      `Giữ trong **60-90 giây** và tối ưu cho tín hiệu senior, không kể tiểu sử.

1. **Hiện tại là ai** - role hiện tại, ~5 năm FE, stack mạnh nhất: Vue 3 / Nuxt / TypeScript.
2. **Đã ship gì** - domain, loại product, quy mô team, impact tới user/business.
3. **Vì sao là senior** - ownership, quyết định kiến trúc, debug, mentoring, delivery khi bài toán còn mơ hồ.
4. **Vì sao apply** - nối background của mình với product hoặc stack của công ty.

Với Parker, nên nói thật React là phần đang tăng tốc chứ chưa phải production specialty. Nói thật như vậy tốt hơn là phóng đại. Cách frame tốt là: **nền tảng FE rất chắc, production depth rõ ở Vue/Nuxt, đang chủ động chuyển các nguyên lý đó sang React/Next**.

Kết bằng một hook để interviewer chọn hướng đào sâu: “Em có thể đi sâu hơn vào architecture, performance, hoặc một project gần đây.”`,
    ),
    example: l(
      `“I'm a senior frontend engineer with about five years of experience, mostly in Vue 3, Nuxt, and TypeScript. Recently I owned an internal admin product from API contract discussion to UI architecture, edge-case handling, and rollout. My strengths are building maintainable frontend structures, debugging production issues, and helping teams make clear trade-offs. I'm now intentionally strengthening React/Next fundamentals because I want to operate fluently across modern FE stacks.”`,
      `“Em là senior frontend engineer với khoảng 5 năm kinh nghiệm, chủ yếu làm với Vue 3, Nuxt và TypeScript. Gần đây em ownership một sản phẩm admin nội bộ từ lúc chốt API contract tới UI architecture, xử lý edge case và rollout. Điểm mạnh của em là dựng cấu trúc frontend maintainable, debug production issue và giúp team ra quyết định trade-off rõ ràng. Hiện tại em cũng đang chủ động tăng tốc React/Next để làm tốt ở nhiều FE stack hiện đại hơn.”`,
    ),
    followUps: [
      l('What area are you currently improving the most?', 'Hiện tại bạn đang cải thiện mạnh nhất ở mảng nào?'),
      l('Which recent project best shows your seniority?', 'Project gần đây nào thể hiện rõ nhất seniority của bạn?'),
    ],
  }),
  q({
    id: 'recent-project',
    category: 'soft',
    tags: ['project', 'star', 'ownership'],
    question: l('Tell me about a recent project.', 'Giới thiệu recent project.'),
    answer: l(
      `Use **STAR**, but keep it technical and measurable.

- **Situation** - product goal, user problem, and constraints.
- **Task** - your ownership boundary. Avoid sounding like you single-handedly built the company.
- **Action** - architecture choices, state strategy, API collaboration, testing, a11y, performance, rollout.
- **Result** - user or team impact, and one thing you would improve next time.

Senior interviewers usually keep drilling after the first layer. Prepare answers for:

1. Why you chose that approach over alternatives.
2. What failed or changed mid-project.
3. How you aligned with BE, design, or PM.
4. What you measured to know it worked.

The best project stories show **judgment under constraints**, not just “I used cool tools.”`,
      `Dùng **STAR**, nhưng phải technical và có impact đo được.

- **Situation** - mục tiêu product, user problem và constraint.
- **Task** - ranh giới ownership của bạn. Tránh kể như thể một mình xây cả công ty.
- **Action** - lựa chọn architecture, state strategy, phối hợp API, testing, a11y, performance, rollout.
- **Result** - impact tới user/team, và một điều bạn sẽ làm tốt hơn lần sau.

Interviewer senior thường đào tiếp sau lớp đầu tiên. Nên chuẩn bị sẵn:

1. Vì sao chọn approach đó thay vì phương án khác.
2. Trong dự án có gì fail hoặc đổi hướng giữa chừng.
3. Bạn align với BE, design hoặc PM như thế nào.
4. Bạn đo bằng gì để biết là nó hiệu quả.

Story tốt nhất là story thể hiện **judgment dưới constraint**, không chỉ là “em dùng tool hay.”`,
    ),
    example: l(
      `“We had to rebuild a role-based admin flow with messy permissions and inconsistent legacy UI. I owned the FE architecture and API contract alignment. I split the surface by domain, pushed URL state for filters, introduced reusable permission guards, and added regression tests for the most failure-prone paths. The result was fewer auth-related support issues and faster onboarding for new engineers because the state ownership became much clearer.”`,
      `“Team em phải rebuild một admin flow có role-based permission khá rối và UI legacy không nhất quán. Em ownership phần FE architecture và align API contract. Em chia surface theo domain, đẩy filter lên URL state, thêm permission guard dùng lại được, và viết regression test cho các path dễ lỗi nhất. Kết quả là ít issue support liên quan auth hơn và người mới onboard nhanh hơn vì state ownership rõ hơn nhiều.”`,
    ),
  }),
  q({
    id: 'ai-daily-work',
    category: 'soft',
    tags: ['ai', 'process', 'quality'],
    question: l('How do you apply AI in your daily work?', 'Áp dụng AI vào công việc hàng ngày như nào?'),
    answer: l(
      `Frame AI as a **productivity multiplier with strict review gates**.

Good uses:

1. Drafting boilerplate, tests, docs, or migration checklists.
2. Explaining stack traces or unfamiliar library APIs.
3. Generating option lists for refactors or design trade-offs.
4. Helping translate ideas between stacks, e.g. Vue mental model to React.

Bad uses:

- Pasting secrets or customer data.
- Merging large generated diffs without understanding them.
- Letting AI make architecture or security decisions unsupervised.
- Accepting code that does not fit team conventions.

Senior signal: say clearly that **the human owns the quality bar**. AI is useful for speed; it is weak on local context, edge cases, and long-term maintainability.`,
      `Hãy frame AI như một **productivity multiplier có cổng review rất chặt**.

Use tốt:

1. Draft boilerplate, test, docs, hoặc checklist migration.
2. Giải thích stack trace hoặc API của library lạ.
3. Tạo danh sách option cho refactor hoặc trade-off thiết kế.
4. Hỗ trợ chuyển mental model giữa các stack, ví dụ từ Vue sang React.

Use xấu:

- Dán secret hoặc customer data.
- Merge một diff AI lớn mà không hiểu nó.
- Để AI tự quyết định architecture hoặc security.
- Chấp nhận code không khớp convention của team.

Tín hiệu senior là nói rất rõ: **người chịu trách nhiệm cuối cùng cho chất lượng luôn là con người**. AI mạnh về tốc độ; yếu ở local context, edge case và maintainability dài hạn.`,
    ),
    example: l(
      `“I use AI heavily for first drafts and comparisons, but I keep the scope small. For example, I might ask for three ways to model a typed API response, then I choose one and rewrite it to fit our codebase. If AI generates a huge component, that's a sign to step back and reshape the problem before considering merge.”`,
      `“Em dùng AI khá nhiều cho first draft và so sánh option, nhưng luôn giữ scope nhỏ. Ví dụ em có thể hỏi 3 cách model typed API response, sau đó tự chọn một cách và rewrite lại theo codebase của team. Nếu AI generate ra một component quá lớn, em xem đó là tín hiệu phải lùi lại và chia lại bài toán trước khi nghĩ tới chuyện merge.”`,
    ),
  }),
  q({
    id: 'mistake-hardship',
    category: 'soft',
    tags: ['failure', 'star', 'learning'],
    question: l(
      'Describe a mistake or difficulty in a project and how you resolved it.',
      'Kể ra 1 sai lầm/khó khăn gặp phải trong dự án và cách giải quyết.',
    ),
    answer: l(
      `Pick a **real** example where the mistake had a cost and changed your process afterward.

Good structure:

1. What went wrong exactly.
2. Why it happened.
3. Impact on users or the team.
4. How you fixed the immediate issue.
5. What prevention you put in place.

Strong FE examples:

- Search race condition showing stale data.
- Missing focus management in a modal.
- Client cache invalidation bug after mutation.
- SSR/hydration mismatch after introducing client-only logic.

Avoid fake weaknesses like “I care too much.” Interviewers want to see honesty, accountability, and system improvement.`,
      `Chọn một ví dụ **thật** mà sai lầm đó có cost và sau đó làm thay đổi process của bạn.

Cấu trúc tốt:

1. Chính xác là sai ở đâu.
2. Vì sao nó xảy ra.
3. Impact tới user hoặc team.
4. Cách bạn xử lý incident trước mắt.
5. Cách bạn phòng ngừa về sau.

Ví dụ FE mạnh:

- Search race condition làm hiện dữ liệu cũ.
- Modal thiếu focus management.
- Bug invalidate client cache sau mutation.
- SSR/hydration mismatch sau khi thêm logic chỉ chạy phía client.

Tránh kiểu điểm yếu giả như “em quá cầu toàn”. Interviewer muốn thấy sự trung thực, tinh thần chịu trách nhiệm và khả năng cải thiện hệ thống.`,
    ),
    example: l(
      `“We once shipped a search flow where rapid typing could display stale results. I had focused on happy-path correctness and overlooked cancellation and response ordering. We fixed it with AbortController plus a request sequence guard, then moved the pattern into a shared helper and added a regression test. The real lesson was to treat concurrency and edge-state behavior as first-class requirements, not polish.”`,
      `“Có lần team em ship một search flow mà khi gõ nhanh có thể hiện kết quả cũ. Lúc đó em tập trung vào happy path mà bỏ sót cancellation và thứ tự response. Team fix bằng AbortController cộng với request sequence guard, sau đó em đưa pattern đó vào shared helper và thêm regression test. Bài học thật là phải coi concurrency và edge-state behavior là requirement chính, không phải polish.”`,
    ),
  }),
  q({
    id: 'what-is-senior',
    category: 'soft',
    tags: ['senior', 'leadership', 'ownership'],
    question: l(
      'In your view, what makes a senior developer?',
      'Đánh giá một senior developer cần phải là một người như nào?',
    ),
    answer: l(
      `A senior is not just a fast coder. The strongest signals are:

1. **Ownership** - can take a vague problem to production with clear trade-offs.
2. **System thinking** - sees FE together with API, UX, accessibility, observability, and business impact.
3. **Judgment** - knows when to simplify, when to invest, and when to say no.
4. **Communication** - aligns people, explains risk, writes decisions down, reviews constructively.
5. **Quality bar** - cares about testing, edge cases, and production safety.
6. **Multiplication** - makes the team stronger through mentoring and better processes.

For interviews, answer with both principle and example. Saying “senior means ownership” is generic. Saying “I reduced ambiguity, aligned BE contracts, and helped juniors reason about state boundaries” is concrete.`,
      `Senior không chỉ là người code nhanh. Tín hiệu mạnh nhất thường là:

1. **Ownership** - cầm một bài toán còn mơ hồ và đưa được tới production với trade-off rõ ràng.
2. **Tư duy hệ thống** - nhìn FE cùng với API, UX, accessibility, observability và business impact.
3. **Judgment** - biết khi nào nên đơn giản hóa, khi nào nên đầu tư, khi nào nên nói không.
4. **Communication** - align nhiều người, giải thích risk, viết decision rõ ràng, review có tính xây dựng.
5. **Quality bar** - quan tâm testing, edge case và độ an toàn khi lên production.
6. **Nhân bản năng lực** - làm team mạnh lên nhờ mentoring và process tốt hơn.

Đi phỏng vấn nên trả lời bằng cả principle lẫn ví dụ. Nói “senior là ownership” thì hơi chung. Nói “em giảm ambiguity, align BE contract và giúp junior reason về state boundary” thì mới đủ cụ thể.`,
    ),
  }),
  q({
    id: 'strengths-weaknesses',
    category: 'soft',
    tags: ['self-awareness', 'career'],
    question: l('What are your strengths and weaknesses?', 'Điểm mạnh và điểm yếu của bạn là gì?'),
    answer: l(
      `Pick strengths that match a senior FE role:

- architectural thinking,
- production debugging,
- turning ambiguity into execution,
- mentoring and code review.

For weaknesses, choose something real but manageable. The best answer includes:

1. the gap,
2. why it matters,
3. what you are doing about it.

For Parker, a strong weakness answer is React production experience. It is honest, relevant, and already being improved.

Avoid weaknesses that make you sound risky for the job, like “I often miss deadlines.”`,
      `Hãy chọn điểm mạnh khớp với role senior FE:

- tư duy kiến trúc,
- debug production,
- biến ambiguity thành execution,
- mentoring và code review.

Với điểm yếu, chọn thứ có thật nhưng đang kiểm soát được. Câu trả lời tốt nên có:

1. khoảng trống là gì,
2. vì sao nó quan trọng,
3. bạn đang làm gì để bù vào.

Với Parker, một câu trả lời mạnh là kinh nghiệm React production chưa nhiều. Nó thật, liên quan và đã có hướng cải thiện rõ.

Tránh các điểm yếu làm bạn trông rủi ro với role, kiểu “em hay trễ deadline”.`,
    ),
    example: l(
      `“My strengths are frontend architecture and debugging under ambiguity. I’m good at mapping state ownership, making trade-offs explicit, and helping teams avoid accidental complexity. My current gap is that most of my production depth is in Vue/Nuxt rather than React. I’m addressing that by building with React/Next intentionally and translating patterns instead of memorizing APIs.”`,
      `“Điểm mạnh của em là frontend architecture và debug khi bài toán còn mơ hồ. Em khá mạnh ở việc map state ownership, làm trade-off rõ ràng và giúp team tránh accidental complexity. Khoảng trống hiện tại là production depth của em tập trung nhiều ở Vue/Nuxt hơn React. Em đang xử lý bằng cách học React/Next có chủ đích và luôn cố dịch pattern, chứ không chỉ học thuộc API.”`,
    ),
  }),
  q({
    id: 'why-company',
    category: 'soft',
    tags: ['motivation', 'research'],
    question: l('Why do you want to join this company?', 'Vì sao bạn muốn vào công ty này?'),
    answer: l(
      `A good answer is a triangle:

1. **Product fit** - why the problem space matters to you.
2. **Skill fit** - where your strengths map to their needs.
3. **Growth fit** - what this role lets you learn next.

Do not give a generic answer that would work for any company. Reference something specific: their domain, engineering standards, stack, scale, or product complexity.

For a senior candidate, motivation should sound like **intentional choice**, not desperation.`,
      `Câu trả lời tốt thường là một tam giác:

1. **Fit về product** - vì sao bài toán của họ đáng để bạn quan tâm.
2. **Fit về kỹ năng** - điểm mạnh của bạn map thế nào vào nhu cầu của họ.
3. **Fit về tăng trưởng** - role này giúp bạn học tiếp điều gì.

Đừng trả lời kiểu chung chung dùng được cho mọi công ty. Hãy nhắc tới thứ cụ thể: domain, engineering standard, stack, scale hoặc độ phức tạp của product.

Với candidate senior, động lực nên nghe như một **lựa chọn có chủ đích**, không phải vì bí quá nên apply đâu cũng được.`,
    ),
  }),
  q({
    id: 'biggest-impact',
    category: 'soft',
    tags: ['impact', 'ownership'],
    question: l('What has been your biggest impact so far?', 'Impact lớn nhất của bạn tới giờ là gì?'),
    answer: l(
      `Pick an example where your impact outlived the ticket itself.

Good forms of impact:

- created a reusable pattern the team kept using,
- improved reliability or delivery speed,
- reduced recurring bugs,
- improved onboarding through clearer architecture,
- created better collaboration between FE and BE.

Senior answers should separate **activity** from **outcome**. “I built a feature” is activity. “I introduced a state model that reduced regressions across three flows” is impact.`,
      `Hãy chọn một ví dụ mà impact của bạn sống lâu hơn chính cái ticket đó.

Các dạng impact tốt:

- tạo được pattern dùng lại lâu dài cho team,
- tăng reliability hoặc tốc độ delivery,
- giảm bug lặp đi lặp lại,
- giúp onboarding tốt hơn nhờ architecture rõ hơn,
- cải thiện cách FE và BE phối hợp.

Câu trả lời senior phải tách được **activity** với **outcome**. “Em làm một feature” là activity. “Em đưa vào một state model giúp giảm regressions ở ba flow khác nhau” mới là impact.`,
    ),
  }),
  q({
    id: 'mentoring-junior',
    category: 'soft',
    tags: ['mentoring', 'leadership'],
    question: l('How do you mentor junior engineers?', 'Bạn mentor junior engineer như thế nào?'),
    answer: l(
      `Mentoring is not just giving answers. A strong approach is:

1. understand the person's current mental model,
2. give them the right next step, not the full solution immediately,
3. review reasoning, not just syntax,
4. teach heuristics they can reuse later.

In FE, useful mentoring topics are state ownership, debugging loops, accessibility basics, and trade-off thinking.

Senior signal: you can adapt mentoring style. Some juniors need structure; others need more autonomy with safety rails.`,
      `Mentor không chỉ là đưa đáp án. Cách tốt thường là:

1. hiểu mental model hiện tại của người đó,
2. đưa đúng “bước kế tiếp” thay vì ném luôn lời giải hoàn chỉnh,
3. review cả reasoning chứ không chỉ syntax,
4. dạy heuristic để lần sau họ tự làm được.

Trong FE, chủ đề mentor rất đáng giá là state ownership, vòng lặp debug, accessibility cơ bản và cách nghĩ trade-off.

Tín hiệu senior là bạn biết đổi style mentoring theo người. Có bạn cần khung rất rõ; có bạn lại cần autonomy nhưng có safety rail.`,
    ),
    example: l(
      `“If a junior is stuck in a component, I usually start by asking them to draw the state map and list inputs, derived data, and side effects. Once they can separate those, the implementation often becomes much simpler. That scales better than me just typing the code for them.”`,
      `“Nếu junior bị kẹt ở một component, em thường bắt đầu bằng việc bảo bạn ấy vẽ state map và liệt kê input, derived data và side effect. Khi tách được ba thứ đó thì phần implement thường tự đơn giản hơn nhiều. Cách đó scale tốt hơn là em nhảy vào code hộ.”`,
    ),
  }),
  q({
    id: 'code-review-approach',
    category: 'soft',
    tags: ['code-review', 'quality'],
    question: l('What is your approach to code review?', 'Cách bạn code review là gì?'),
    answer: l(
      `Good code review optimizes for **quality, shared understanding, and momentum**.

My review stack is usually:

1. correctness and edge cases,
2. architecture and maintainability,
3. accessibility, performance, and security,
4. naming and readability,
5. consistency with existing patterns.

I try to leave comments that explain **why**, not just “change this.” I also separate blocking issues from stylistic suggestions so reviews do not feel random.

For large PRs, senior behavior is often to reduce scope first rather than review a 2,000-line diff blindly.`,
      `Code review tốt tối ưu cho **quality, shared understanding và tốc độ tiến lên của team**.

Thứ tự em review thường là:

1. correctness và edge case,
2. architecture và maintainability,
3. accessibility, performance và security,
4. naming và readability,
5. consistency với pattern đang có.

Em cố để lại comment giải thích **vì sao**, không chỉ nói “đổi chỗ này”. Em cũng tách rõ chỗ nào blocking, chỗ nào chỉ là suggestion để review không bị cảm tính.

Với PR quá lớn, hành vi senior thường là yêu cầu giảm scope trước, thay vì review mù một diff 2.000 dòng.`,
    ),
  }),
  q({
    id: 'disagree-tech-decision',
    category: 'soft',
    tags: ['conflict', 'decision-making'],
    question: l(
      'What do you do when you disagree with a technical decision?',
      'Bạn làm gì khi không đồng ý với một technical decision?',
    ),
    answer: l(
      `Start with curiosity, not ego.

1. Confirm the actual goal and constraints.
2. State your concern in terms of risk or trade-off.
3. Offer a concrete alternative, not vague resistance.
4. Use a lightweight experiment or spike if needed.
5. Once a decision is made, commit unless new evidence appears.

Senior behavior is not “winning arguments.” It is helping the team make the best decision with the available information.`,
      `Bắt đầu bằng sự tò mò chứ không phải ego.

1. Xác nhận mục tiêu và constraint thật sự là gì.
2. Nêu concern của mình dưới dạng risk hoặc trade-off.
3. Đưa ra alternative cụ thể, không chỉ phản đối chung chung.
4. Nếu cần thì đề xuất spike hoặc thử nghiệm nhỏ.
5. Khi đã chốt quyết định thì commit cùng team, trừ khi có evidence mới.

Hành vi senior không phải là “thắng tranh luận”. Mà là giúp team ra quyết định tốt nhất với thông tin đang có.`,
    ),
  }),
  q({
    id: 'handle-ambiguity',
    category: 'soft',
    tags: ['ambiguity', 'ownership'],
    question: l('How do you handle ambiguous requirements?', 'Bạn xử lý requirement mơ hồ như thế nào?'),
    answer: l(
      `A senior does not wait passively for perfect requirements.

I usually:

1. break the problem into user outcomes, constraints, and unknowns,
2. write assumptions explicitly,
3. turn unknowns into questions for PM / design / BE,
4. propose a thin slice or draft acceptance criteria,
5. validate early with examples or wireframes.

The goal is to **reduce ambiguity cheaply** before writing too much code.`,
      `Một senior không ngồi chờ requirement hoàn hảo.

Em thường:

1. tách bài toán thành user outcome, constraint và điểm chưa biết,
2. viết assumption ra rõ ràng,
3. biến phần mơ hồ thành câu hỏi cho PM / design / BE,
4. đề xuất thin slice hoặc draft acceptance criteria,
5. validate sớm bằng ví dụ hoặc wireframe.

Mục tiêu là **giảm ambiguity với chi phí thấp** trước khi viết quá nhiều code.`,
    ),
  }),
  q({
    id: 'prioritize-deadline-scope',
    category: 'soft',
    tags: ['prioritization', 'delivery'],
    question: l(
      'If scope is large but the deadline is fixed, how do you handle it?',
      'Nếu scope lớn nhưng deadline cố định, bạn xử lý thế nào?',
    ),
    answer: l(
      `Do not silently accept impossible scope.

1. Clarify what is truly must-have vs nice-to-have.
2. Surface the trade-off early: scope, quality, staffing, or timeline.
3. Propose a phased delivery plan.
4. Protect the risky foundations: correctness, auth, payment, data integrity, accessibility of critical flows.
5. Keep stakeholders updated as reality changes.

The senior move is to make trade-offs explicit early, not to heroically absorb chaos until the last week.`,
      `Đừng âm thầm nhận một scope bất khả thi.

1. Làm rõ cái gì thật sự must-have, cái gì nice-to-have.
2. Nói trade-off càng sớm càng tốt: scope, quality, staffing hay timeline.
3. Đề xuất delivery theo phase.
4. Bảo vệ các phần nền tảng nhiều risk: correctness, auth, payment, data integrity, accessibility của flow critical.
5. Cập nhật stakeholder khi thực tế thay đổi.

Nước đi senior là làm trade-off lộ ra sớm, không phải cố hero gồng mọi thứ tới tuần cuối.`,
    ),
  }),
  q({
    id: 'influence-without-authority',
    category: 'soft',
    tags: ['influence', 'leadership'],
    question: l(
      'How do you influence decisions when you are not the formal lead?',
      'Bạn ảnh hưởng tới quyết định thế nào khi không phải lead chính thức?',
    ),
    answer: l(
      `Influence usually comes from clarity and trust, not title.

Useful techniques:

- bring evidence instead of opinion only,
- write concise problem statements,
- propose options with trade-offs,
- make it easy for others to agree by reducing ambiguity,
- show that you care about the team's outcome, not personal credit.

People often follow engineers who make complexity understandable and reduce decision cost.`,
      `Ảnh hưởng thường đến từ sự rõ ràng và niềm tin, không phải chức danh.

Các cách hiệu quả:

- mang evidence chứ không chỉ mang opinion,
- viết problem statement ngắn gọn,
- đề xuất option kèm trade-off,
- làm người khác dễ đồng ý hơn bằng cách giảm ambiguity,
- cho thấy bạn quan tâm tới outcome của team chứ không phải credit cá nhân.

Mọi người thường nghe theo người giúp biến sự phức tạp thành thứ dễ hiểu và giảm chi phí ra quyết định.`,
    ),
  }),
  q({
    id: 'stakeholder-communication',
    category: 'soft',
    tags: ['communication', 'stakeholders'],
    question: l(
      'How do you communicate with PMs, designers, and backend engineers?',
      'Bạn giao tiếp với PM, designer và backend engineer như thế nào?',
    ),
    answer: l(
      `Adjust the level of abstraction to the audience.

- With **PM**, talk in terms of user impact, risk, scope, and sequencing.
- With **design**, talk in terms of interaction states, accessibility, edge cases, and maintainability.
- With **BE**, talk in terms of contracts, error models, consistency, and performance.

Senior communication is about reducing surprises. You do that by surfacing assumptions, edge cases, and dependencies early.`,
      `Hãy đổi mức abstraction theo từng đối tượng.

- Với **PM**, nói theo user impact, risk, scope và thứ tự delivery.
- Với **design**, nói theo interaction state, accessibility, edge case và maintainability.
- Với **BE**, nói theo contract, error model, consistency và performance.

Giao tiếp kiểu senior là giảm bất ngờ cho mọi bên. Muốn vậy phải lộ assumption, edge case và dependency sớm.`,
    ),
  }),
  q({
    id: 'legacy-refactor-pitch',
    category: 'soft',
    tags: ['refactor', 'technical-debt'],
    question: l(
      'How do you convince the team to pay down frontend technical debt?',
      'Bạn thuyết phục team trả nợ kỹ thuật frontend như thế nào?',
    ),
    answer: l(
      `Do not sell refactor as “clean code because I like it.”

Connect the debt to concrete costs:

- slow feature delivery,
- recurring regressions,
- onboarding pain,
- production incidents,
- inability to support new product requirements.

Then propose a realistic path:

1. small scoped refactor,
2. success criteria,
3. migration plan,
4. risk control,
5. opportunity to couple it with upcoming feature work.

Debt work gets approved more often when framed as **risk reduction or speed enablement**.`,
      `Đừng bán refactor kiểu “vì em thích code sạch”.

Hãy nối món nợ đó với cost cụ thể:

- feature đi chậm,
- regressions lặp lại,
- onboard khó,
- incident production,
- không hỗ trợ được requirement product mới.

Sau đó đưa ra một con đường thực tế:

1. refactor scope nhỏ,
2. tiêu chí thành công,
3. kế hoạch migration,
4. kiểm soát risk,
5. gắn nó với feature sắp làm nếu phù hợp.

Debt work dễ được duyệt hơn khi được frame là **giảm risk hoặc mở đường cho delivery nhanh hơn**.`,
    ),
  }),
  q({
    id: 'giving-feedback',
    category: 'soft',
    tags: ['feedback', 'teamwork'],
    question: l('How do you give difficult feedback?', 'Bạn đưa feedback khó nghe như thế nào?'),
    answer: l(
      `Keep it specific, respectful, and behavior-focused.

Good pattern:

1. describe observable behavior,
2. explain impact,
3. ask for their perspective,
4. align on a better behavior,
5. follow up later.

Avoid vague labels like “you are careless.” Say “the PR skipped error-state handling twice, which created rework in review.” The point is to help the person improve, not to vent frustration.`,
      `Hãy giữ feedback cụ thể, tôn trọng và tập trung vào hành vi.

Pattern tốt:

1. mô tả hành vi quan sát được,
2. giải thích impact,
3. hỏi perspective của họ,
4. thống nhất hành vi tốt hơn,
5. follow up lại sau đó.

Tránh gắn nhãn kiểu “em cẩu thả”. Nên nói “PR này đã bỏ sót error-state handling hai lần, làm team phải rework nhiều khi review”. Mục tiêu là giúp người đó cải thiện, không phải xả bực.`,
    ),
  }),
  q({
    id: 'cross-team-collaboration',
    category: 'soft',
    tags: ['collaboration', 'delivery'],
    question: l('Tell me about cross-team collaboration.', 'Kể về một lần bạn phối hợp cross-team.'),
    answer: l(
      `Choose a story where the difficulty was not just technical but also coordination-related.

Good ingredients:

- dependency on another team,
- mismatched priorities,
- unclear contracts,
- rollout risk across systems.

Explain how you created alignment: shared requirements, demo checkpoints, contract docs, phased rollout, or fallback plan. Senior collaboration often means **reducing coordination failure**, not just writing code faster.`,
      `Hãy chọn một story mà khó khăn không chỉ là technical mà còn là phối hợp.

Thành phần tốt thường có:

- phụ thuộc vào team khác,
- ưu tiên lệch nhau,
- contract chưa rõ,
- rollout risk qua nhiều hệ thống.

Nói rõ bạn đã tạo alignment bằng cách nào: shared requirement, checkpoint demo, doc contract, rollout theo phase hay fallback plan. Phối hợp kiểu senior thường là **giảm failure do coordination**, không chỉ code nhanh hơn.`,
    ),
  }),
  q({
    id: 'onboarding-new-member',
    category: 'soft',
    tags: ['mentoring', 'process'],
    question: l('How do you onboard a new frontend engineer?', 'Bạn onboard một frontend engineer mới thế nào?'),
    answer: l(
      `A good onboarding plan gives context, safe contribution, and fast feedback.

1. Explain product, architecture, and development workflow.
2. Show the state/data flow of one representative feature.
3. Give a starter task with bounded scope.
4. Pair on the first PR or two.
5. Provide written references: conventions, folder structure, debugging tips.

The goal is not just to help them ship one ticket. It is to help them form the right mental model quickly.`,
      `Onboarding tốt phải cho người mới đủ context, có nơi contribute an toàn và nhận feedback nhanh.

1. Giải thích product, architecture và development workflow.
2. Chỉ ra state/data flow của một feature đại diện.
3. Giao một task mở đầu có scope rõ.
4. Pair ở 1-2 PR đầu.
5. Có tài liệu viết sẵn: convention, folder structure, mẹo debug.

Mục tiêu không chỉ là để họ ship 1 ticket. Mà là giúp họ hình thành mental model đúng càng sớm càng tốt.`,
    ),
  }),
  q({
    id: 'estimating-frontend-work',
    category: 'soft',
    tags: ['estimation', 'delivery'],
    question: l('How do you estimate frontend work?', 'Bạn estimate công việc frontend như thế nào?'),
    answer: l(
      `Estimate by decomposing uncertainty, not by guessing total hours.

Useful dimensions:

- new UI vs repeated pattern,
- API certainty,
- edge cases and validation,
- accessibility needs,
- testing scope,
- rollout and migration cost.

When a task is uncertain, call that out explicitly and propose a spike or range. Good senior estimates include **what could make the number wrong**.`,
      `Hãy estimate bằng cách tách uncertainty ra, không phải đoán đại một con số tổng.

Các chiều nên nhìn:

- UI mới hoàn toàn hay pattern lặp lại,
- API đã chắc chưa,
- số lượng edge case và validation,
- nhu cầu accessibility,
- phạm vi testing,
- chi phí rollout hoặc migration.

Nếu task còn mơ hồ, hãy nói rõ điều đó và đề xuất spike hoặc estimate theo range. Estimate kiểu senior luôn có phần **vì sao con số này có thể sai**.`,
    ),
  }),
  q({
    id: 'learning-react-as-vue-dev',
    category: 'soft',
    tags: ['react', 'learning'],
    question: l(
      'How would you explain your React learning journey coming from Vue?',
      'Bạn sẽ giải thích hành trình học React của mình khi đi từ Vue như thế nào?',
    ),
    answer: l(
      `Be honest and strategic.

Say that Vue is your production strength, but you are learning React by mapping **concepts**, not memorizing API differences:

- Vue reactivity vs React re-render model,
- composables vs custom hooks,
- watchers/lifecycle vs effects,
- Pinia mental model vs server-state libraries plus context/reducers,
- Nuxt SSR mental model vs Next App Router and RSC.

This makes you sound like an engineer who transfers principles between ecosystems, not a framework tourist.`,
      `Hãy trung thực và có chiến lược.

Bạn có thể nói Vue là production strength của mình, còn React đang được học theo hướng map **khái niệm**, chứ không học thuộc khác biệt API:

- Vue reactivity vs React re-render model,
- composable vs custom hook,
- watcher/lifecycle vs effect,
- mental model của Pinia vs server-state library cộng context/reducer,
- mental model SSR của Nuxt vs Next App Router và RSC.

Cách nói này khiến bạn trông như một engineer biết chuyển nguyên lý giữa các ecosystem, chứ không phải người nhảy framework theo trend.`,
    ),
  }),
  q({
    id: 'quality-bar-definition',
    category: 'soft',
    tags: ['quality', 'engineering'],
    question: l('What does a good quality bar look like to you?', 'Quality bar tốt với bạn là như thế nào?'),
    answer: l(
      `A good quality bar is not perfection. It is a consistent standard relative to risk.

For frontend, that usually includes:

- correct behavior including error and empty states,
- acceptable accessibility,
- reasonable performance,
- maintainable structure,
- observability for critical failures,
- enough test coverage for risky behavior.

Senior engineers adjust the bar by context, but they do not let urgent delivery become an excuse for avoidable instability.`,
      `Quality bar tốt không phải là sự hoàn hảo. Nó là một chuẩn nhất quán tương xứng với mức độ rủi ro.

Với frontend, thường gồm:

- hành vi đúng kể cả error state và empty state,
- accessibility ở mức chấp nhận được,
- performance hợp lý,
- cấu trúc maintainable,
- observability cho failure quan trọng,
- đủ test ở các hành vi nhiều risk.

Senior engineer biết chỉnh quality bar theo context, nhưng không lấy lý do “gấp quá” để hợp thức hóa sự bất ổn có thể tránh được.`,
    ),
  }),
  q({
    id: 'when-to-say-no',
    category: 'soft',
    tags: ['leadership', 'judgment'],
    question: l('When do you say no to a request?', 'Khi nào bạn nói không với một yêu cầu?'),
    answer: l(
      `You say no when the request creates disproportionate risk or undermines the team's goals.

Common cases:

- impossible deadline with hidden quality cost,
- shortcut that weakens security or data integrity,
- technical direction that creates large long-term pain for small short-term gain,
- scope that distracts from more important outcomes.

Good senior “no” is usually paired with an alternative: “I would not do X, but I can support Y this sprint and Z next.”`,
      `Bạn nói không khi yêu cầu đó tạo ra risk quá lớn hoặc đi ngược mục tiêu của team.

Ví dụ thường gặp:

- deadline bất khả thi nhưng giấu quality cost,
- shortcut làm yếu security hoặc data integrity,
- hướng technical gây đau lâu dài lớn để đổi lấy lợi ích ngắn hạn nhỏ,
- scope làm lệch khỏi outcome quan trọng hơn.

Một câu “không” kiểu senior thường đi kèm alternative: “Em không khuyến nghị làm X, nhưng em có thể hỗ trợ Y trong sprint này và Z ở bước tiếp theo.”`,
    ),
  }),
  q({
    id: 'tradeoff-example',
    category: 'soft',
    tags: ['tradeoff', 'decision-making'],
    question: l('Give an example of a technical trade-off you made.', 'Cho ví dụ về một technical trade-off bạn đã đưa ra.'),
    answer: l(
      `Pick an example where neither option was obviously perfect.

Good trade-off stories:

- SSR vs SPA for a specific flow,
- server pagination vs client flexibility,
- quick patch vs deeper refactor,
- using a library vs building in-house,
- co-locating state vs globalizing it.

What matters is not the choice alone. It is whether you can explain **context, options, risks, and why the chosen downside was acceptable**.`,
      `Hãy chọn ví dụ mà không có option nào hoàn hảo tuyệt đối.

Story trade-off tốt có thể là:

- SSR vs SPA cho một flow cụ thể,
- server pagination vs tính linh hoạt phía client,
- patch nhanh vs refactor sâu,
- dùng library vs tự build,
- giữ state local hay đẩy lên global.

Điều interviewer quan tâm không chỉ là lựa chọn cuối cùng, mà là bạn có giải thích được **context, option, risk và vì sao downside đã chọn là chấp nhận được** hay không.`,
    ),
  }),
  q({
    id: 'proud-project',
    category: 'soft',
    tags: ['impact', 'story'],
    question: l('Which project are you most proud of and why?', 'Bạn tự hào nhất về project nào và vì sao?'),
    answer: l(
      `Choose a project that shows both technical skill and maturity.

Great reasons include:

- you solved an ambiguous, high-impact problem,
- you improved a system rather than just built a screen,
- you helped the team level up during delivery,
- the solution aged well and stayed maintainable.

Avoid choosing something only because it was large. Often the most senior story is one where you simplified complexity for others.`,
      `Hãy chọn project thể hiện cả kỹ năng technical lẫn sự trưởng thành trong cách làm việc.

Lý do tốt thường là:

- bạn giải được một bài toán impact lớn nhưng còn mơ hồ,
- bạn cải thiện được cả hệ thống chứ không chỉ làm một màn hình,
- bạn giúp team level up trong quá trình delivery,
- solution bền theo thời gian và vẫn maintainable.

Tránh chọn chỉ vì nó “to”. Nhiều khi story senior nhất lại là story bạn làm cho sự phức tạp trở nên đơn giản hơn với cả team.`,
    ),
  }),
  q({
    id: 'conflict-with-designer',
    category: 'soft',
    tags: ['conflict', 'design'],
    question: l(
      'How do you handle disagreement with a designer or PM?',
      'Bạn xử lý bất đồng với designer hoặc PM như thế nào?',
    ),
    answer: l(
      `Keep the conversation anchored to the shared goal: user outcome.

Typical pattern:

1. confirm what problem the other person is trying to solve,
2. explain your concern using concrete impact,
3. propose alternative interactions or phased solutions,
4. validate with examples if possible.

Avoid turning it into “engineering vs product.” The best discussions become “how do we get the outcome with acceptable complexity and risk?”`,
      `Giữ cuộc trao đổi bám vào mục tiêu chung: user outcome.

Pattern thường là:

1. xác nhận người kia đang cố giải bài toán gì,
2. nêu concern của mình bằng impact cụ thể,
3. đề xuất interaction khác hoặc cách làm theo phase,
4. nếu được thì validate bằng ví dụ.

Tránh biến nó thành “engineering vs product”. Cuộc trao đổi tốt nhất sẽ trở thành “làm sao đạt outcome đó với độ phức tạp và risk chấp nhận được?”`,
    ),
  }),
  q({
    id: 'career-growth-plan',
    category: 'soft',
    tags: ['growth', 'career'],
    question: l('What do you want to grow into next?', 'Bạn muốn phát triển tiếp theo hướng nào?'),
    answer: l(
      `For a senior FE role, a strong answer balances depth and range.

Example growth areas:

- stronger cross-stack fluency, especially React/Next,
- better system design for larger frontend surfaces,
- deeper performance and observability practice,
- more influence in mentoring and technical decision-making.

The answer should sound grounded in the next few years of work, not like a generic leadership script.`,
      `Với role senior FE, câu trả lời mạnh thường cân bằng giữa depth và breadth.

Ví dụ các hướng phát triển:

- tăng fluency cross-stack, đặc biệt ở React/Next,
- giỏi hơn về system design cho frontend surface lớn,
- sâu hơn về performance và observability,
- ảnh hưởng nhiều hơn ở mentoring và technical decision.

Câu trả lời nên nghe gắn với vài năm làm việc tới, chứ không phải một leadership script chung chung.`,
    ),
  }),
  q({
    id: 'deal-with-production-pressure',
    category: 'soft',
    tags: ['incident', 'pressure'],
    question: l(
      'How do you behave under production pressure?',
      'Bạn làm việc như thế nào khi có áp lực production?',
    ),
    answer: l(
      `Senior behavior under pressure is calm triage, not panic heroics.

1. stabilize the situation,
2. gather facts before guessing,
3. communicate clearly and often,
4. separate immediate mitigation from root-cause work,
5. follow up with prevention.

Interviewers want to hear that you can stay structured when the system is not.`,
      `Hành vi senior khi có áp lực production là triage bình tĩnh, không phải hoảng rồi làm hero.

1. ổn định tình hình trước,
2. gom fact trước khi đoán,
3. communicate rõ và đều,
4. tách mitigation trước mắt với root-cause fix,
5. sau đó follow-up bằng phòng ngừa.

Interviewer muốn nghe rằng khi hệ thống rối, bạn vẫn giữ được cấu trúc suy nghĩ.`,
    ),
  }),
  q({
    id: 'success-metrics-senior',
    category: 'soft',
    tags: ['impact', 'senior'],
    question: l(
      'How do you measure your success as a senior engineer?',
      'Bạn đo thành công của mình như một senior engineer bằng gì?',
    ),
    answer: l(
      `Not only by lines of code or number of tickets.

I would look at:

- product outcomes and reliability,
- quality of decisions over time,
- reduced team friction,
- how quickly others can contribute safely,
- whether the codebase becomes easier or harder to evolve.

The more senior you become, the more your success is tied to **team leverage and system health**, not just personal throughput.`,
      `Không chỉ bằng số dòng code hay số ticket đóng.

Em thường nhìn vào:

- product outcome và reliability,
- chất lượng quyết định theo thời gian,
- mức độ friction của team có giảm không,
- người khác có contribute an toàn nhanh hơn không,
- codebase có dễ tiến hóa hơn hay khó hơn.

Càng senior thì thành công của mình càng gắn với **team leverage và sức khỏe của hệ thống**, chứ không chỉ throughput cá nhân.`,
    ),
  }),
]
