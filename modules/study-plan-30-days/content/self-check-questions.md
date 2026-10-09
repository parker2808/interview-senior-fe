# Self-check — câu hỏi Senior FE

Dùng cuối tuần hoặc trước mock interview. Trả lời ngắn (bullet), không cần viết dài. Gắn câu trả lời vào **một hệ thống bạn đã ship**, không phải một feature Capstone trên giấy.

## Interview answer shape

Mọi câu dưới đây nên nói theo cùng một khung:

1. **Họ thực sự hỏi gì** — không trả lời slogan
2. **Decision** — bạn chọn gì
3. **Constraint** — thời gian, API, permission, bundle, team
4. **Failure mode** — chuyện gì vỡ nếu chọn sai
5. **Measure** — metric, user symptom, hoặc cách bạn biết fix có tác dụng
6. **Tradeoff** — option bạn từ chối và cái giá

Nếu không kể được failure + measure trong dưới 2 phút, câu đó chưa interview-ready.

## Product
- User thật sự muốn hoàn thành task gì trên hệ thống bạn đã ship?
- Có thể giảm số step không?
- Happy path và failure path là gì?
- Requirement nào đang là assumption?

## UI/UX
- Primary action có rõ không?
- User có biết system đang loading không?
- Empty state có hướng dẫn next action không?
- Error có recover được không?
- Destructive action có safeguard không?

## Responsive
- Device nào thực sự phải support?
- Table xử lý thế nào trên màn nhỏ?
- Có content nào ưu tiên hơn content khác?
- Touch target có đủ lớn?

## Accessibility
- Không dùng mouse có hoàn thành task được không?
- Form có label đúng không?
- Focus có predictable không?
- Screen reader có hiểu state change không?

## Architecture
- Component này có quá nhiều responsibility không?
- State có đúng owner không?
- Có duplicate source of truth không?
- Business logic có bị nhét vào view không?

## API
- Contract nullable rõ chưa?
- Error contract rõ chưa?
- Date/timezone?
- Pagination?
- Concurrent update?

## Security
- User input đi đâu?
- Có render raw HTML không?
- Permission chỉ check ở UI?
- Sensitive data có lưu browser không?

## Performance
- Bottleneck là network hay render?
- Có request duplicate?
- Có race condition?
- DOM có quá lớn?

## Testing
- Test đang verify behavior hay implementation detail?
- Critical flow có E2E chưa?
- Error path có test chưa?
- Test có tạo false confidence không?

## AI
- Prompt có đủ context không?
- AI assumption nào chưa verify?
- Đã review security/a11y chưa?
- Có hiểu code AI tạo không?

## Work management
- Task đã break đủ nhỏ chưa?
- Unknown lớn nhất là gì?
- Dependency nào có thể block?
- Có communicate risk sớm không?

Quay lại [Plan 30 ngày](./30-day-study-plan.md).
