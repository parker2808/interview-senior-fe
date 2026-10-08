# Leadership & Soft Skills

Senior nhận câu **behavioral + tech-lead** trong cùng loop với Vue. Họ không chấm charisma. Họ muốn **phán đoán lặp lại được**: bạn grow người thế nào, đóng băng quyết định kiến trúc, estimate khi bất định, bất đồng mà không đốt phòng, và nói chuyện lúc incident.

Định hình câu trả lời theo **STAR** (Situation, Task, Action, Result) với **decision → constraint → failure mode → measure** bên trong Action. Giữ story hình FE: review, flag, CWV, incident, scope PM.

---

## Table of Contents

1. [Mentorship Kỹ thuật](#171-mentorship-kỹ-thuật)

2. [Ghi chép Quyết định Kiến trúc (ADR)](#172-ghi-chép-quyết-định-kiến-trúc-adr)

3. [Ước lượng Độ phức tạp](#173-ước-lượng-độ-phức-tạp)

4. [Giải quyết Xung đột](#174-giải-quyết-xung-đột)

5. [Nói không / Push back với PM](#175-nói-không--push-back-với-pm)

6. [Code review như một hình thức leadership](#176-code-review-như-một-hình-thức-leadership)

7. [Giao tiếp khi incident](#177-giao-tiếp-khi-incident)

---

## 17. Leadership & Soft Skills

### 17.1. Mentorship Kỹ thuật

**Họ thực sự hỏi gì**

- “Bạn mentor junior thế nào?”
- “Kể về người không theo kịp.”
- “Khi nào bạn cầm keyboard?”

**Cách senior trả lời**

- **Quyết định:** **Calibrate theo người**, không theo chương trình. Mục tiêu của một giờ là **delivery**, **learning**, hoặc **safety** — chọn một. Review và pair để **dạy quyết định tiếp theo**, không sản xuất code của bạn gắn tên họ.
- **Ràng buộc:** Bạn vẫn sở hữu chất lượng team và sự tự tin của mentee. Hover thì không lớn; bỏ mặc thì ra production bug và xấu hổ.
- **Failure mode:** Pair bằng cách giật keyboard mỗi lỗi syntax; review chỉ nói “nit”; growth plan giống nhau cho mọi người; tránh underperformance đến khi PIP là bất ngờ.
- **Đo:** họ ship một slice một mình; comment review cùng theme giảm; họ giải thích được *why* trong standup; 1:1 có goal đổi theo thời gian.

**Khung STAR**

- **S/T:** Hire mới tuần 2, ticket Pinia + `useAsyncData` đầu, hoặc mid kẹt ở “implement ticket.”
- **A:** Chẩn đoán *cái gì* thiếu (domain, Vue, communication). Đặt **thanh tường minh nhỏ** (“PR này: loading/error/empty, test trên composable”). Pair seam đầu, rồi họ lái. Review bằng câu hỏi, không bằng patch. Nếu blocked >N giờ, bạn vào — không để họ chết đuối qua đêm.
- **R:** Ticket landed; họ reuse pattern ở feature sau; bạn viết pattern ra nên bạn không phải bus factor.

**Calibrate**

| Tín hiệu | Nước cờ |
| --- | --- |
| Lạc trong repo | Navigate cùng; họ ghi chú *chỗ nào* là sự thật |
| JS mạnh, Vue yếu | Kata composable + một PR production |
| Nhanh nhưng ẩu | Thanh review trên a11y/error, không khen tốc độ |
| Im trong review | Nhờ họ review PR *của bạn* trước |

**Khi cầm keyboard vs không**

- **Cầm:** production incident, security, họ kẹt đau môi trường, bạn demo một *nước* 3 phút (“xem extract, rồi bạn làm lại”).
- **Không:** feature branch tuần 5 của họ, “tôi làm nhanh hơn,” hoặc rewrite PR trên GitHub UI. Cái đó dạy sự phụ thuộc.

**Growth plan**

Viết ra, 90 ngày, 2–3 outcome (“sở hữu checkout error kể cả Sentry”), không phải “giỏi TypeScript hơn.” Revisit trong 1:1. Stretch ticket với backup có tên.

**Underperformance**

Sớm, cụ thể, riêng: ví dụ, thanh kỳ vọng, hỗ trợ (lịch pair), timeline. Document. Nếu misfit (họ muốn làm backend), giúp họ chuyển. Nếu không cải thiện, escalate bằng **fact** — trì hoãn không phải tử tế; phần còn lại của team đã gánh.

**Tradeoff**

- Velocity ngắn hạn vs senior thứ hai sau sáu tháng.
- Bảo vệ user (bạn cầm hotfix) vs bảo vệ học (họ cầm cái tiếp theo, bạn on call).

**Gotcha production**

- “Mentoring” chỉ là giao CSS tạp.
- Shame công khai trong review (“như tôi đã bảo…”).
- Chỉ mentor người giống bạn.

**Câu hỏi nối**

- Mentor **peer senior** thế nào? (RFC, rotating lead, nhờ họ sở hữu một slice DS)
- Nếu họ designer visual giỏi hơn bạn? (bạn học; họ không được skip a11y)

---

### 17.2. Ghi chép Quyết định Kiến trúc (ADR)

**Họ thực sự hỏi gì**

“Document quyết định thế nào?” / “Pinia vs Vuex — bạn có viết ADR không?”

**Cách senior trả lời**

- **Quyết định:** Viết ADR khi lựa chọn **đắt để đảo** hoặc **sáu tháng sau trông ngẫu nhiên**: mô hình render, thư viện state, BFF vs aggregation FE, MF vs monorepo, auth cookie vs token, “vì sao không GraphQL.” Giữ **một đến hai trang**. Status: proposed → accepted → superseded.
- **Ràng buộc:** Không ai đọc tiểu thuyết. Giá trị là **context + alternatives + consequences**, không phải template.
- **Failure mode:** ADR cho mỗi lần đổi tên component; ADR đẹp không ai link từ code; dùng ADR để **thắng cãi sau khi đã ship**; không bao giờ supersede, nên repo nói dối.
- **Đo:** hire mới tìm được *vì sao* Pinia, *vì sao* Nuxt `routeRules`, *vì sao* không MF? Thời gian tranh lại lựa chọn đã chốt (phải giảm).

**Ngắn thế nào**

```markdown
# ADR-012: Filters live in the URL on the ops dashboard

Status: Accepted
Context: Support shares views; back button was broken (Pinia-only).
Decision: Typed query params are the source of truth; Pinia not used for filters.
Consequences: SSR/share work; secrets must not go in the URL.
Rejected: sessionStorage (not shareable), saved views only (too much backend for v1).
```

Đủ vậy. Link từ README dashboard và PR.

**Disagree and commit**

Bạn cãi trong RFC bằng **data hoặc spike** (17.4). Owner có tên **quyết** trước deadline. Bạn **commit** (implement đường đã chọn, không comment phá đám). Nếu evidence production mới xuất hiện, bạn **mở lại** bằng ADR supersede — không fork thầm.

**Khi không viết**

Bugfix, local refactor, “dùng `const`.” Nếu team hai người prototype cuối tuần, Slack thread + ADR sau khi tốt nghiệp là ổn.

**Tradeoff**

- Quá nhiều ADR (nhiễu) vs kiến thức bộ lạc trong đầu một architect.
- Markdown nhẹ trong repo vs Confluence (repo thắng; nó cạnh code).

**Gotcha production**

- ADR nói “không MF,” org công bố MF anyway — update status, đừng giả vờ.
- Quyết định ghi mà không **owner** và **ngày review**.

**Câu hỏi nối**

- Cho xem ADR bạn hối. (Senior tốt thì có một.)
- Tương tác RFC vs Jira thế nào?

---

### 17.3. Ước lượng Độ phức tạp

**Họ thực sự hỏi gì**

“Bạn estimate thế nào?” Họ đánh hơi **độ chính xác giả** và việc đổ lỗi “cái estimate” về sau.

**Cách senior trả lời**

- **Quyết định:** Estimate **độ bất định và kích thước**, communicate **khoảng**, split đến khi một slice dạy được. Story point (nếu team dùng) so **độ phức tạp tương đối**, chúng **không phải giờ**. Date cho stakeholder là **forecast kèm confidence**, không phải cam kết điểm bạn bịa từ “5 point = 2 ngày.”
- **Ràng buộc:** Estimate frontend chết vì: design mơ, thiếu API, a11y, i18n, feature flag, analytics, empty/error state, migration, **browser matrix**. Nếu những thứ đó không có trong ticket, con số là nói dối.
- **Failure mode:** “Hai giờ” trên thay đổi auth; pad mọi ticket bí mật (sandbag) nên không ai plan được; từ chối forecast hết; convert velocity point của team thành spreadsheet người-giờ trong phỏng vấn.
- **Đo:** tỷ lệ forecast vs actual **trúng khoảng**, bao nhiêu lần “unknown” được liệt kê trước, % story bị split giữa sprint (phải giảm).

**STAR**

- **S:** PM muốn “filter + export + realtime” trong một sprint.
- **T:** Đưa một số họ plan được.
- **A:** Split: URL filter (đã biết), export (cần job backend), realtime (spike). Range phần đã biết; **time-box spike** (1 ngày) trước khi estimate phần còn. Liệt kê dependency. Nói **cái gì làm nó ×3** (pagination API sai, 50k hàng).
- **R:** Sprint ship filter; export là cái sau; không ai “trượt estimate.”

**Bất định**

Nếu không nêu được API contract, bạn không có estimate — bạn có task **discovery**. Định giá discovery **tường minh**.

**Story point vs date**

- Point: planning *trong* team, velocity là chỉ báo **trễ**, không phải contract.
- Date: exec cần chúng. Bạn dịch với **confidence** (“khả năng Thứ Năm này, tệ nhất Thứ Ba tuần sau nếu VAT API trượt”) và **lever scope** (cắt export, không cắt test).
- Đừng thuộc bảng “1 point = 2 giờ.” Đó là bẫy junior.

**Buffer mà không sandbag**

- Buffer ở tầng **plan** (integration, review, QA, “API sẽ đổi”) — nhìn thấy được.
- Đừng nhân mọi story ×2 giấu. Cái đó dạy PM bỏ qua số của bạn.
- Nêu thực tế **lịch**: holiday, on-call, vòng hiring.

**Tradeoff**

- Planning poker vs bạn estimate một mình (dùng team cho bất định; đừng average 2 và 13 mà không nói).
- T-shirt size cho roadmap, point cho sprint.

**Gotcha production**

- Quên khoảng trống design-system (“cứ dùng Button”) thành một tuần.
- Estimate chỉ happy path (các state 13.3).
- Velocity dùng làm rating hiệu suất — sẽ bị game; nói bạn sẽ chống.

**Câu hỏi nối**

- Estimate rewrite thế nào? (strangle từng slice, không blob 6 tháng)
- Nếu họ đòi date hôm nay? (khoảng + list giả định)

---

### 17.4. Giải quyết Xung đột

**Họ thực sự hỏi gì**

“Kể một lần bất đồng.” Họ muốn **process người lớn**, không phải “tôi dễ làm việc.”

**Cách senior trả lời**

- **Quyết định:** Xung đột **kỹ thuật** nhận **data, spike, và owner quyết định**. Xung đột **tính cách / tôn trọng** nhận **nói chuyện riêng** trước. Escalate bằng **lựa chọn**, không bằng than phiền.
- **Ràng buộc:** Product vẫn phải ship. Consensus không luôn khả thi; ấm ức thầm thì đắt.
- **Failure mode:** Cãi tabs-vs-spaces trên Slack một tuần; gọi tên ai đó trong standup; escalate kiểu “họ khó tính” không có option; “disagree and commit” dùng để bịt evidence.
- **Đo:** time-to-decision, ADR có tồn tại không, quan hệ còn chạy trong review không, cùng một trận có tái diễn không.

**STAR (kỹ thuật)**

- **S:** Teammate muốn Module Federation; bạn muốn package monorepo (15.4).
- **T:** Đừng tách team.
- **A:** Viết cả hai option một trang (chi phí, ranh giới team, LCP). Time-box spike nếu cần. Kéo người **sở hữu** outcome. Quyết. Bạn implement đường đã chọn.
- **R:** Quyết định được ghi; trigger revisit có tên (“khi có hai lịch deploy”).

**STAR (tính cách)**

- **S:** Review cảm giác cá nhân; họ merge dù comment blocking của bạn.
- **A:** 1:1, ví dụ cụ thể, impact lên user/on-call. Thống nhất review SLA. Nếu tiếp diễn, kéo manager **kèm** ví dụ đó và working agreement đề xuất.
- **R:** Blocking vs nit được làm rõ (17.6); không còn merge bất ngờ.

**Escalate bằng lựa chọn**

“Ta có thể (A) ship URL filter sprint này và hoãn WS, (B) trượt một tuần vì WS, (C) bỏ export. Tôi recommend A vì SLA của support. Cần bạn chọn trước Wednesday.”

Đó là leadership. “Bảo họ tôi đúng” thì không.

**Tradeoff**

- Để lựa chọn đảo được đi (đặt tên css) vs giữ lằn (auth, a11y, user data).
- Tranh kỹ thuật công khai (tốt, có document) vs tranh cá nhân công khai (xấu).

**Gotcha production**

- “Data-driven” nhưng bạn chỉ gom data ủng hộ mình.
- Tránh conflict chỉ qua manager — team ngửi được.

**Câu hỏi nối**

- Nếu owner quyết định sai trên production? (ADR supersede, không I-told-you-so trên Slack)
- Xuyên team: FE vs backend sở hữu BFF?

---

### 17.5. Nói không / Push back với PM

**Họ thực sự hỏi gì**

“PM muốn Friday. QA mỏng. Bạn biết không an toàn. Bạn làm gì?”

**Cách senior trả lời**

- **Quyết định:** Đừng nói **không** với **mục tiêu**. Nói **không với plan** vi phạm constraint, rồi đưa **lever**: scope, date, risk (flag), thanh chất lượng. Cụ thể về **impact user**, không phải “engineering excellence.”
- **Ràng buộc:** PM được chấm theo outcome. Nếu bạn chỉ block, họ đi đường khác. Nếu không bao giờ block, bạn sở hữu incident.
- **Failure mode:** Silent hero-weekend; chua “sure, whatever”; deck 12 slide để reject đổi copy; push back bất ngờ trong sprint review trước exec.
- **Đo:** incident từ việc vội (phải giảm), % “phải Friday” thực sự là vậy, trust trong planning (họ vẫn kéo bạn vào sớm).

**STAR**

- **S:** Thêm Apple Pay tuần này, gồm SDK mới, không sandbox, copy legal chưa xong.
- **T:** Bảo vệ checkout; vẫn giúp campaign nếu được.
- **A:** Nêu risk (double charge, a11y, SDK 3MB trên `/pricing` — 12.3). Đưa: (1) đường Stripe-only **flag** sau staff, (2) Apple Pay sprint sau với owner có tên, (3) landing campaign **không** đổi checkout. Hỏi mục tiêu Friday thực sự là gì: **experiment conversion** vs **tender mới**.
- **R:** Họ chọn (1) hoặc (3); bạn không thành blocker của công ty, bạn thành người làm lựa chọn **nhìn thấy được**.

**Cụm câu chạy**

- “Ship A trước Friday nếu cắt B, hoặc giữ B và dời date.”
- “Tôi làm với **kill switch** và owner rollback. Không có những thứ đó tôi không yên tâm đặt lên payment path.”
- “Đây là đổi **product contract**, không phải chỉnh UI 2 giờ” (18.3).

Push back **sớm** (discovery), cùng kênh với request, kèm giả định viết ra.

**Tradeoff**

- Vốn chính trị: tiêu trên safety/ethics/legal, không trên thư viện yêu thích.
- “Không phải bây giờ” vs “không bao giờ” — đưa điều kiện revisit.

**Gotcha production**

- Nói yes với hai PM độc lập.
- Dùng estimate làm vũ khí (phình số để ép không).

**Câu hỏi nối**

- Nếu PM cũng là người skip-level yêu thích? (vẫn viết risk; copy manager; đừng đi rogue)
- Design muốn video background trên `/` lúc campaign? (budget CWV — số)

---

### 17.6. Code review như một hình thức leadership

**Họ thực sự hỏi gì**

“Review tốt từ senior trông thế nào?”

**Cách senior trả lời**

- **Quyết định:** Review là cách bạn **scale taste**. Ưu tiên **correctness phía user, security, a11y, mất data, performance budget** hơn style. Phân **blocking** vs **nit**. Dạy bằng *why*. Cân load để một người không thành bottleneck — kể cả **bạn** không review mọi thứ.
- **Ràng buộc:** Kích thước PR và SLA. PR 40 file không review thành thật được; đó là fail process, không phải fail reviewer.
- **Failure mode:** rubber stamp; comment viết lại cả PR; block vì prettier; chỉ senior được merge; bỏ test; pile-on công khai.
- **Đo:** time-to-first-review, defect thoát, junior merge được không cần bạn, theme comment lặp (fix bằng lint/ADR).

**Blocking vs không**

| Block | Đừng block |
| --- | --- |
| Authz, PII, XSS, focus gãy, silent catch | Đặt tên, thứ tự import (automate) |
| Thiếu error/empty state trên user flow | Thích `const` trong script setup |
| Bundle lib nặng mới trên `/` | “Tôi sẽ tách composable khác” — gợi ý, đừng giữ |

Nếu bạn không revert prod vì nó, khả năng không blocking. Prefix `nit:`.

**Dạy**

Hỏi “API 409 thì sao?” trước khi dán patch. Link KB/ADR. Nếu cùng comment hai lần, **lint hoặc fixture**. Approve khi **risk** đã xử, dù không phải cách bạn viết (disagree and commit).

**Như leadership**

- Review **test của họ** nghiêm như SFC.
- Kéo reviewer a11y hoặc DS khi đổi primitive.
- Bảo vệ người: đưa thread nóng sang call.
- PR của bạn: nhỏ, mô tả, **nêu** review bạn cần (“focus abort logic”).

**Tradeoff**

- Bắt hai approve vs tốc độ. Path high-risk (payment, flag) thêm; docs thì không.
- Review async vs pair PR gnarly (nhanh hơn 40 comment).

**Gotcha production**

- “LGTM” trên generated lockfile + đổi webpack config.
- Review sau merge vì tin CI mù (CI không bắt product contract).

**Câu hỏi nối**

- Review đổi DS thế nào? (visual + a11y + semver)
- Nếu author senior hơn bạn? (cùng thanh; status không phải correctness)

---

### 17.7. Giao tiếp khi incident

**Họ thực sự hỏi gì**

“Checkout down. Bạn nói gì, với ai, khi nào?”

**Cách senior trả lời**

- **Quyết định:** Communicate theo **đồng hồ**: cái ta **biết**, **impact** (ai, action nào fail), **đang làm gì**, **lần update tiếp theo khi nào** — kể cả update là “vẫn đang điều tra.” Tách **status user/PM** khỏi **debug engineering**. Không blame trên channel.
- **Ràng buộc:** Incident frontend thường **một phần** (một locale, một browser, một flag, một chunk 404). “Là DNS / là backend” sớm phí thời gian; im lặng làm người ta panic.
- **Failure mode:** Biến mất trong DevTools 40 phút; cãi root cause trong #incidents; tweet trước legal; tắt hết flag; “tôi nghĩ đã fix” không có **watch period**.
- **Đo:** thời gian **mitigate** (flag/rollback), thời gian **impact chính xác**, độ chính xác phía customer, tỷ lệ incident lặp, postmortem blameless tồn tại.

**STAR**

- **S:** Sentry spike, checkout JS throw sau deploy (19.6).
- **A:**
  1. **Mitigate trước:** revert GitOps digest hoặc giết flag (14.1/14.4). Đừng debug trên prod khi user cháy nếu rollback an toàn.
  2. **Channel:** “Checkout submit fail ~X% từ 14:02 UTC, error `QUOTE_EXPIRED` / chunk 404. Impact: không thanh toán được. Workaround: không. Update tiếp 14:15. Owner: <bạn>.”
  3. **Chỉ fact.** “Có thể Safari” ở lại thread engineering đến khi confirm.
  4. Sau mitigate: **confirm** bằng RUM/Sentry/canary buy. Rồi RCA.
- **R:** User được mở trong phút; postmortem có action item (budget gate, map upload, flag default).

**Audience**

- Eng: giả thuyết, graph, PR.
- PM/support: impact + workaround + ETA **lần communicate tiếp**, không ETA root cause vũ trụ.
- User/status page: chỉ khi user thấy và process của bạn nói vậy; FE thường qua PM.

**Dấu hiệu đặc thù FE**

- “Works for me” → hỏi **release, flag, locale, browser**.
- Chunk 404 → HTML cache xấu (16.2).
- Chỉ 10% → flag hoặc canary.

**Tradeoff**

- Rollback vs forward-fix: rollback trừ khi rollback tệ hơn (data migration). Flag tồn tại vì việc này.
- Over-communicate (nhiễu) vs im radio 30 phút.

**Gotcha production**

- Root-cause trong status message (“PR của intern”).
- Tuyên bố chiến thắng phút Sentry xanh đầu (traffic tụt).
- Không owner, năm người sửa `main`.

**Câu hỏi nối**

- Kể lại postmortem bạn viết. (timeline, contributing factor, fix **hệ thống**)
- Page thế nào? (19.5 — không phải mọi JS error)

---

[← Back to Overview](../../README.md)
