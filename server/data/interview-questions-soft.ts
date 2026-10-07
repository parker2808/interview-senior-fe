import { l, q } from './interview-questions-shared'
import type { InterviewQuestion } from './interview-questions-shared'

export const INTERVIEW_SOFT_QUESTIONS: InterviewQuestion[] = [
  q({
    id: 'self-intro',
    category: 'soft',
    tags: ['intro', 'senior'],
    question: l('Introduce yourself.', 'Giới thiệu bản thân.'),
    answer: l(
      `**Short answer:** Keep it to **60-90 seconds** and structure it around current role, strongest stack, recent ownership, and why you fit this job.

**Why this works:**

1. Start with who you are now: senior FE, ~5 years, strongest in Vue 3 / Nuxt / TypeScript.
2. Move to what you have shipped: product/domain, team context, and user impact.
3. Add senior signals: architecture decisions, debugging, mentoring, and delivery under ambiguity.
4. End with why this role makes sense for you.

**Trade-offs / things to avoid:**

- Do not tell your life story.
- Do not bluff React production depth if you do not have it.
- Do not list tools without showing ownership or outcomes.

For Parker specifically, the strongest framing is: **deep production experience in Vue/Nuxt, strong frontend fundamentals, and active React/Next ramp-up through concept transfer rather than memorization**.

End with a hook such as: “Happy to go deeper into architecture, performance, or a recent project.”`,
      `**Trả lời ngắn:** Giữ trong **60-90 giây** và đi theo cấu trúc role hiện tại, stack mạnh nhất, ownership gần đây, rồi vì sao bạn fit với role này.

**Vì sao cách này hiệu quả:**

1. Mở đầu bằng hiện tại: senior FE, ~5 năm, mạnh nhất ở Vue 3 / Nuxt / TypeScript.
2. Chuyển sang cái đã ship: domain/product, bối cảnh team và impact tới user.
3. Thêm tín hiệu senior: quyết định kiến trúc, debug, mentoring và delivery khi bài toán còn mơ hồ.
4. Kết bằng lý do vì sao role này hợp với mình.

**Trade-off / điều nên tránh:**

- Đừng kể tiểu sử quá dài.
- Đừng bluff React production depth nếu chưa có.
- Đừng chỉ liệt kê tool mà không cho thấy ownership hoặc outcome.

Với Parker, cách frame mạnh nhất là: **production depth rõ ở Vue/Nuxt, nền tảng frontend rất chắc, và đang tăng tốc React/Next bằng cách chuyển nguyên lý giữa các hệ hơn là học thuộc API**.

Nên kết bằng hook kiểu: “Em có thể đi sâu hơn vào architecture, performance hoặc một project gần đây.”`,
    ),
    example: l(
      `“I'm a senior frontend engineer with about five years of experience, mostly in Vue 3, Nuxt, and TypeScript. Recently I owned an internal admin product from API contract discussion to UI architecture, edge-case handling, and rollout. My strengths are building maintainable frontend structures, debugging production issues, and helping teams make clear trade-offs. I'm now intentionally strengthening React/Next fundamentals because I want to operate fluently across modern FE stacks.”`,
      `“Em là senior frontend engineer với khoảng 5 năm kinh nghiệm, chủ yếu làm với Vue 3, Nuxt và TypeScript. Gần đây em ownership một sản phẩm admin nội bộ từ lúc chốt API contract tới UI architecture, xử lý edge case và rollout. Điểm mạnh của em là dựng cấu trúc frontend maintainable, debug production issue và giúp team ra quyết định trade-off rõ ràng. Hiện tại em cũng đang chủ động tăng tốc React/Next để làm tốt ở nhiều FE stack hiện đại hơn.”`,
    ),
    followUps: [
      l('What area are you currently improving the most?', 'Hiện tại bạn đang cải thiện mạnh nhất ở mảng nào?'),
      l('Which recent project best shows your seniority?', 'Project gần đây nào thể hiện rõ nhất seniority của bạn?'),
      l('Why should we trust you on React if your production depth is in Vue?', 'Vì sao bên em nên tin bạn ở React khi production depth của bạn nằm ở Vue?'),
    ],
  }),
  q({
    id: 'recent-project',
    category: 'soft',
    tags: ['project', 'star', 'ownership'],
    question: l('Tell me about a recent project.', 'Giới thiệu recent project.'),
    answer: l(
      `**Short answer:** Use **STAR**, but make the “Action” section technical and the “Result” section measurable.

**Why this works:**

- **Situation** explains the user problem and constraints.
- **Task** defines your ownership boundary.
- **Action** is where you show senior judgment: architecture, state ownership, API collaboration, testing, a11y, performance, rollout.
- **Result** proves impact on users, bugs, team speed, or support load.

**Trade-offs / things to avoid:**

- Do not claim you owned everything if you did not.
- Do not spend 80% of the answer on project background.
- Do not stop at “we used X library”; explain why.

Senior interviewers usually drill deeper on trade-offs, failure points, and alignment. The best project answer shows **judgment under constraints**, not just activity.`,
      `**Trả lời ngắn:** Dùng **STAR**, nhưng phần “Action” phải technical và phần “Result” phải đo được.

**Vì sao cách này hiệu quả:**

- **Situation** giải thích user problem và constraint.
- **Task** xác định ranh giới ownership của bạn.
- **Action** là nơi thể hiện judgment của senior: architecture, state ownership, phối hợp API, testing, a11y, performance, rollout.
- **Result** chứng minh impact lên user, bug, tốc độ của team hoặc support load.

**Trade-off / điều nên tránh:**

- Đừng nhận mình ownership tất cả nếu thực tế không phải vậy.
- Đừng dành 80% thời gian để kể bối cảnh dự án.
- Đừng dừng ở mức “team em dùng library X”; phải giải thích vì sao.

Interviewer senior thường đào sâu vào trade-off, điểm fail và cách align với các bên. Một project answer tốt phải thể hiện **judgment dưới constraint**, không chỉ là activity.`,
    ),
    example: l(
      `“We had to rebuild a role-based admin flow with messy permissions and inconsistent legacy UI. I owned the FE architecture and API contract alignment. I split the surface by domain, pushed URL state for filters, introduced reusable permission guards, and added regression tests for the most failure-prone paths. The result was fewer auth-related support issues and faster onboarding for new engineers because the state ownership became much clearer.”`,
      `“Team em phải rebuild một admin flow có role-based permission khá rối và UI legacy không nhất quán. Em ownership phần FE architecture và align API contract. Em chia surface theo domain, đẩy filter lên URL state, thêm permission guard dùng lại được, và viết regression test cho các path dễ lỗi nhất. Kết quả là ít issue support liên quan auth hơn và người mới onboard nhanh hơn vì state ownership rõ hơn nhiều.”`,
    ),
    followUps: [
      l('Why did you choose that state strategy instead of a global store?', 'Vì sao bạn chọn state strategy đó thay vì đẩy hết vào global store?'),
      l('What went wrong during the project and what did you change?', 'Trong dự án có gì đi sai và bạn đã đổi hướng thế nào?'),
      l('How did you measure whether the change was successful?', 'Bạn đo thành công của thay đổi đó bằng cách nào?'),
    ],
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
      `**Short answer:** A senior developer is someone who reduces ambiguity, makes sound trade-offs, and raises the quality of both the system and the team.

**Why this is the right frame:**

1. **Ownership** - can move a vague problem to production.
2. **System thinking** - sees FE together with API, UX, a11y, observability, and business goals.
3. **Judgment** - knows when to simplify, invest, or push back.
4. **Communication** - explains risk, aligns people, documents decisions.
5. **Multiplication** - mentors others and leaves the codebase clearer than before.

**Trade-offs / things to avoid:**

- Do not define seniority only by years.
- Do not answer only in principles; attach at least one concrete example.
- Do not confuse “coding fast” with “owning outcomes”.

The best answer sounds like a mix of technical depth, product sense, and team leverage.`,
      `**Trả lời ngắn:** Senior developer là người giảm được ambiguity, đưa ra trade-off hợp lý, và nâng chất lượng của cả hệ thống lẫn team.

**Vì sao nên frame như vậy:**

1. **Ownership** - đưa được một bài toán mơ hồ tới production.
2. **Tư duy hệ thống** - nhìn FE cùng với API, UX, a11y, observability và business goal.
3. **Judgment** - biết lúc nào nên đơn giản hóa, đầu tư thêm hoặc phản biện.
4. **Communication** - giải thích risk, align nhiều người, ghi lại decision rõ ràng.
5. **Nhân bản năng lực** - mentor người khác và để lại codebase rõ ràng hơn trước.

**Trade-off / điều nên tránh:**

- Đừng định nghĩa seniority chỉ bằng số năm.
- Đừng trả lời toàn bằng principle; nên gắn ít nhất một ví dụ thật.
- Đừng nhầm “code nhanh” với “ownership outcome”.

Câu trả lời tốt nhất nên nghe như sự kết hợp giữa technical depth, product sense và team leverage.`,
    ),
    followUps: [
      l('Can you give a recent example that proves that level of ownership?', 'Bạn có ví dụ gần đây nào chứng minh mức ownership đó không?'),
      l('How do you balance speed with quality as a senior?', 'Bạn cân bằng tốc độ với chất lượng như một senior thế nào?'),
    ],
  }),
  q({
    id: 'strengths-weaknesses',
    category: 'soft',
    tags: ['self-awareness', 'career'],
    question: l('What are your strengths and weaknesses?', 'Điểm mạnh và điểm yếu của bạn là gì?'),
    answer: l(
      `**Short answer:** Pick strengths that match the role, and choose one real weakness that is relevant but actively being improved.

**Strong strengths for this profile:**

- frontend architecture and state modeling,
- production debugging,
- turning ambiguity into execution,
- mentoring and review quality.

**Good weakness structure:**

1. name the gap,
2. explain why it matters,
3. show the plan already in motion.

For Parker, “most of my production depth is in Vue/Nuxt, and I am actively strengthening React/Next” is a strong weakness answer because it is honest and recoverable.

**Trade-offs / things to avoid:**

- Do not give a fake weakness.
- Do not choose a weakness that makes you sound unsafe for the role.
- Do not say you are improving it without concrete evidence.`,
      `**Trả lời ngắn:** Hãy chọn điểm mạnh khớp với role, và chọn một điểm yếu có thật nhưng đang được cải thiện chủ động.

**Điểm mạnh hợp với profile này:**

- frontend architecture và state modeling,
- debug production,
- biến ambiguity thành execution,
- mentoring và chất lượng review.

**Cấu trúc tốt cho điểm yếu:**

1. gọi tên khoảng trống,
2. nói vì sao nó quan trọng,
3. cho thấy kế hoạch cải thiện đã chạy rồi.

Với Parker, “production depth của em chủ yếu nằm ở Vue/Nuxt, và em đang chủ động tăng tốc React/Next” là một câu trả lời mạnh vì nó thật và có thể bù được.

**Trade-off / điều nên tránh:**

- Đừng dùng điểm yếu giả.
- Đừng chọn điểm yếu làm bạn trông không an toàn cho role.
- Đừng nói đang cải thiện nếu không có bằng chứng cụ thể.`,
    ),
    example: l(
      `“My strengths are frontend architecture and debugging under ambiguity. I’m good at mapping state ownership, making trade-offs explicit, and helping teams avoid accidental complexity. My current gap is that most of my production depth is in Vue/Nuxt rather than React. I’m addressing that by building with React/Next intentionally and translating patterns instead of memorizing APIs.”`,
      `“Điểm mạnh của em là frontend architecture và debug khi bài toán còn mơ hồ. Em khá mạnh ở việc map state ownership, làm trade-off rõ ràng và giúp team tránh accidental complexity. Khoảng trống hiện tại là production depth của em tập trung nhiều ở Vue/Nuxt hơn React. Em đang xử lý bằng cách học React/Next có chủ đích và luôn cố dịch pattern, chứ không chỉ học thuộc API.”`,
    ),
    followUps: [
      l('How are you closing the React gap in practice?', 'Bạn đang lấp khoảng trống React đó trong thực tế bằng cách nào?'),
      l('Which strength do you think matters most in this role?', 'Theo bạn điểm mạnh nào quan trọng nhất với role này?'),
    ],
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
      `**Short answer:** Be honest that Vue is your production strength, then explain that you are learning React by transferring **principles**, not memorizing APIs.

**The strongest comparison points are:**

- Vue reactivity vs React re-render model,
- composables vs custom hooks,
- watcher/lifecycle patterns vs effects,
- Pinia mindset vs React state/server-state tools,
- Nuxt SSR mental model vs Next App Router and RSC.

**Why this answer is strong:**

- it avoids bluffing,
- it shows depth in fundamentals,
- it proves you can learn ecosystems by reasoning, not cargo-culting.

**Trade-offs / things to avoid:**

- Do not say React and Vue are “basically the same”.
- Do not apologize too much for the gap.
- Do not make the answer only about syntax differences.

This framing makes you sound like an engineer with transferable frontend depth.`,
      `**Trả lời ngắn:** Hãy nói thẳng Vue là production strength của mình, rồi giải thích rằng bạn đang học React bằng cách chuyển **nguyên lý**, không phải học thuộc API.

**Các điểm so sánh mạnh nhất là:**

- Vue reactivity vs React re-render model,
- composable vs custom hook,
- watcher/lifecycle pattern vs effect,
- tư duy Pinia vs bộ công cụ state/server-state ở React,
- mental model SSR của Nuxt vs Next App Router và RSC.

**Vì sao câu trả lời này mạnh:**

- không bluff,
- cho thấy nền tảng rất chắc,
- chứng minh bạn học ecosystem bằng reasoning chứ không cargo-cult.

**Trade-off / điều nên tránh:**

- Đừng nói React và Vue “gần như giống nhau”.
- Đừng xin lỗi quá nhiều về khoảng trống này.
- Đừng biến câu trả lời thành chuyện khác biệt cú pháp.

Cách frame này khiến bạn trông như một engineer có độ sâu frontend chuyển đổi được giữa các hệ.`,
    ),
    example: l(
      `A concise version: “My production depth is in Vue/Nuxt, but I’m learning React by mapping concepts. For example, I compare Vue’s fine-grained reactivity with React’s re-render model, composables with custom hooks, and Nuxt SSR mental models with Next App Router. That approach helps me learn React in a way that will hold up in production.”`,
      `Một phiên bản ngắn gọn: “Production depth của em nằm ở Vue/Nuxt, nhưng em học React bằng cách map nguyên lý. Ví dụ em so Vue reactivity với React re-render model, composable với custom hook, và mental model SSR của Nuxt với Next App Router. Cách học đó giúp em tiếp cận React theo kiểu có thể đứng vững trong production sau này.”`,
    ),
    followUps: [
      l('What has been the hardest React mental shift for you?', 'Mental shift khó nhất của bạn khi học React là gì?'),
      l('How would you ramp up safely on a React codebase in the first month?', 'Nếu vào một codebase React, bạn sẽ ramp up an toàn trong tháng đầu thế nào?'),
    ],
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
