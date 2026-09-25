/* ============================================================
   THÁM TỬ KINH TẾ — CASE DATABASE
   8 vụ án gian lận tài chính đầy đủ dữ liệu
   ============================================================ */

const CASES_DB = [
  {
    id: "enron-2001",
    slug: "enron-2001",
    title: "Enron: Đế chế Năng lượng Sụp đổ",
    subtitle: "Vụ gian lận kế toán lớn nhất lịch sử Mỹ (thời điểm 2001)",
    year: 2001,
    country: "USA",
    countryFlag: "🇺🇸",
    sector: "Năng lượng",
    damage: "$74 tỷ USD",
    damageValue: 74000000000,
    damageVND: null,
    severity: "critical",
    featured: true,
    icon: "⚡",
    categories: ["doanh-thu", "no-phai-tra", "cong-ty-lien-ket"],
    standards: ["ISA 240", "ISA 550", "ISA 540", "ISA 315"],
    trickShort: "Dùng Special Purpose Entities (SPE) để ẩn nợ khổng lồ ra ngoài BCTC",
    views: 15420,
    comments: 89,
    timeline: {
      context: "Enron Corporation là công ty năng lượng lớn thứ 7 tại Mỹ vào năm 2001, được tạp chí Fortune bình chọn là 'Công ty sáng tạo nhất nước Mỹ' 6 năm liên tiếp. Cổ phiếu đỉnh điểm đạt $90/cổ phiếu. Tuy nhiên phía sau vẻ hào nhoáng là một mạng lưới gian lận phức tạp.",
      trick: "Enron lập ra hơn 3.000 công ty bình phong SPE (Special Purpose Entities) như Raptor, Chewco, JEDI để chuyển các khoản nợ và tài sản xấu ra ngoài bảng cân đối kế toán. Công ty ghi nhận doanh thu từ các hợp đồng tương lai năng lượng theo phương pháp 'mark-to-market' — tức là ghi nhận lợi nhuận ngay khi ký hợp đồng dù tiền chưa về. Kế toán cũng thao túng giá điện tại California tạo ra khủng hoảng điện giả tạo.",
      audit_failure: "Công ty kiểm toán Arthur Andersen — một trong Big 5 thời điểm đó — đã ký báo cáo kiểm toán chấp nhận toàn phần trong nhiều năm. Kiểm toán viên không điều tra độc lập các SPE, bỏ qua mối quan hệ liên kết và xung đột lợi ích. Nghiêm trọng hơn, nhân viên Arthur Andersen đã tiêu hủy tài liệu kiểm toán khi bắt đầu bị điều tra — vi phạm nghiêm trọng ISA 230.",
      consequence: "Enron phá sản tháng 12/2001 — vụ phá sản lớn nhất lịch sử Mỹ lúc bấy giờ. CEO Jeffrey Skilling bị kết án 24 năm tù, CFO Andrew Fastow 6 năm tù. Hãng kiểm toán Arthur Andersen sụp đổ hoàn toàn sau 89 năm tồn tại. Đạo luật Sarbanes-Oxley (SOX) 2002 ra đời trực tiếp từ vụ bê bối này, thay đổi toàn bộ ngành kiểm toán thế giới."
    },
    lessons: [
      "SPE cần được hợp nhất vào BCTC nếu thực chất do công ty kiểm soát (ISA 550 - Các bên liên quan)",
      "Phương pháp mark-to-market cần đánh giá thận trọng cho tài sản không có thị trường hoạt động (ISA 540)",
      "Kiểm toán viên phải duy trì tính độc lập và hoài nghi nghề nghiệp khi kiểm tra giao dịch với bên liên quan",
      "Tiêu hủy tài liệu kiểm toán là vi phạm pháp luật nghiêm trọng (ISA 230)"
    ],
    downloads: [
      { name: "BCTC Enron 2000 (có dấu hiệu bất thường)", type: "PDF", size: "2.4 MB", free: false },
      { name: "Checklist phát hiện SPE trong BCTC", type: "XLSX", size: "128 KB", free: true }
    ]
  },
  {
    id: "wirecard-2020",
    slug: "wirecard-2020",
    title: "Wirecard: 1,9 Tỷ Euro Không Tồn Tại",
    subtitle: "Vụ gian lận lớn nhất lịch sử Đức — tiền mặt 'ma' trong tài khoản ngân hàng Philippines",
    year: 2020,
    country: "Germany",
    countryFlag: "🇩🇪",
    sector: "Fintech / Thanh toán điện tử",
    damage: "€1,9 tỷ EUR",
    damageValue: 2090000000,
    damageVND: null,
    severity: "critical",
    featured: true,
    icon: "💳",
    categories: ["tien-mat", "tai-san-ao"],
    standards: ["ISA 505", "ISA 240", "ISA 330", "ISA 402"],
    trickShort: "Tạo tiền mặt 'ma' €1,9 tỷ trong tài khoản ngân hàng Philippines thông qua bên thứ ba giả mạo",
    views: 12340,
    comments: 67,
    timeline: {
      context: "Wirecard AG là tập đoàn fintech Đức được ví như 'PayPal của châu Âu', từng có vốn hóa 24 tỷ euro và lọt vào chỉ số DAX 30 (30 công ty blue-chip lớn nhất Đức). Cổ phiếu tăng 1.500% từ 2015-2018. Financial Times đã đăng loạt bài điều tra từ 2019 nhưng bị ban lãnh đạo phủ nhận.",
      trick: "Wirecard báo cáo có €1,9 tỷ tiền mặt gửi tại 2 ngân hàng ủy thác ở Philippines. Khi kiểm toán viên EY yêu cầu xác nhận, ngân hàng Philippines gửi văn bản xác nhận số dư — nhưng đây là chứng từ giả mạo được tạo ra bởi mạng lưới cộng đồng với ban lãnh đạo Wirecard. Số tiền này chưa bao giờ tồn tại. Ngoài ra, công ty còn thổi phồng doanh thu thông qua các 'Third-Party Acquirers' (TPA) — đối tác xử lý thanh toán ma.",
      audit_failure: "EY (Ernst & Young) đã kiểm toán Wirecard trong 10 năm (2009-2019) và liên tục ký báo cáo chấp nhận toàn phần. EY không thực hiện xác nhận độc lập trực tiếp với ngân hàng Philippines (vi phạm ISA 505). Kiểm toán viên chỉ dựa vào chứng từ do chính Wirecard cung cấp thay vì tự xác minh. EY cũng không điều tra kỹ các TPA dù có dấu hiệu rủi ro cao từ 2016.",
      consequence: "Wirecard khai phá sản tháng 6/2020 sau khi thừa nhận tiền không tồn tại. Cổ phiếu từ €100 xuống gần €0 chỉ trong 2 tuần. CEO Markus Braun bị bắt tại Munich, hiện đang bị xét xử. COO Jan Marsalek bỏ trốn, được cho là đang ẩn náu tại Nga. EY bị kiện đòi bồi thường hàng tỷ euro và toàn bộ ngành kiểm toán châu Âu bị rà soát lại."
    },
    lessons: [
      "Xác nhận tiền gửi ngân hàng PHẢI được gửi trực tiếp từ kiểm toán viên đến ngân hàng, không qua trung gian (ISA 505)",
      "Cần thẩm tra độc lập các đối tác bên thứ ba có giá trị giao dịch lớn bất thường (ISA 240)",
      "Rủi ro từ đơn vị được kiểm toán ủy thác cho bên thứ ba cần được đánh giá đặc biệt (ISA 402)",
      "Cảnh báo từ báo chí/nhà phân tích độc lập là dấu hiệu rủi ro cần kiểm tra, không thể bỏ qua"
    ],
    downloads: [
      { name: "Checklist xác nhận tiền gửi ngân hàng độc lập", type: "XLSX", size: "95 KB", free: true },
      { name: "Phân tích kỹ thuật TPA fraud indicators", type: "PDF", size: "1.8 MB", free: false }
    ]
  },
  {
    id: "worldcom-2002",
    slug: "worldcom-2002",
    title: "WorldCom: Vốn Hóa Chi Phí $11 Tỷ",
    subtitle: "Gian lận kế toán đơn giản nhưng tàn khốc — phân loại chi phí thành tài sản",
    year: 2002,
    country: "USA",
    countryFlag: "🇺🇸",
    sector: "Viễn thông",
    damage: "$11 tỷ USD",
    damageValue: 11000000000,
    damageVND: null,
    severity: "critical",
    featured: true,
    icon: "📡",
    categories: ["chi-phi", "tai-san-co-dinh"],
    standards: ["ISA 540", "ISA 240", "VSA 310"],
    trickShort: "Chuyển $11 tỷ chi phí vận hành (OPEX) thành tài sản vốn (CAPEX) để che giấu lỗ",
    views: 9870,
    comments: 54,
    timeline: {
      context: "WorldCom là công ty viễn thông lớn thứ 2 tại Mỹ sau AT&T, cung cấp dịch vụ cho hàng triệu thuê bao. Cuối thập niên 1990, ngành viễn thông suy thoái sau bong bóng dot-com vỡ, chi phí thuê đường truyền tăng vọt đe dọa lợi nhuận.",
      trick: "CFO Scott Sullivan chỉ đạo kế toán chuyển hơn $11 tỷ chi phí thuê đường truyền (line cost — chi phí vận hành OPEX) sang phân loại là 'Tài sản đầu tư' (CAPEX). Điều này làm giảm chi phí trên báo cáo lợi nhuận, che giấu tình trạng thua lỗ thực sự. Kỹ thuật này cực kỳ đơn giản nhưng quy mô khổng lồ.",
      audit_failure: "Arthur Andersen cũng là kiểm toán viên của WorldCom (cùng với Enron). Kiểm toán viên không thực hiện kiểm tra chi tiết phân loại chi phí, không đặt câu hỏi về sự thay đổi bất thường trong tỷ lệ CAPEX/Doanh thu. Chính kiểm toán nội bộ của WorldCom — dưới sự lãnh đạo của Cynthia Cooper — mới phát hiện ra gian lận này sau khi tự điều tra.",
      consequence: "WorldCom phá sản tháng 7/2002 — vụ phá sản lớn nhất lịch sử Mỹ (vượt cả Enron). CEO Bernard Ebbers bị kết án 25 năm tù. CFO Scott Sullivan hợp tác với điều tra, lĩnh 5 năm tù. Cynthia Cooper — Internal Auditor phát hiện vụ bê bối — được TIME Magazine chọn là 'Nhân vật của năm 2002'."
    },
    lessons: [
      "Kiểm toán viên phải kiểm tra tính hợp lý của phân loại CAPEX vs OPEX, đặc biệt khi tỷ lệ CAPEX bất thường (ISA 540)",
      "Phân tích xu hướng chi phí (line cost/revenue ratio) là công cụ phân tích dữ liệu hiệu quả",
      "Bộ phận kiểm toán nội bộ độc lập là tuyến phòng thủ quan trọng (điều kiện VSA 315)",
      "Nguyên tắc nhất quán trong phân loại kế toán phải được kiểm tra qua các kỳ"
    ],
    downloads: [
      { name: "Template phân tích CAPEX vs OPEX bất thường", type: "XLSX", size: "112 KB", free: true },
      { name: "Case Study đầy đủ WorldCom fraud", type: "PDF", size: "3.2 MB", free: false }
    ]
  },
  {
    id: "van-thinh-phat-2022",
    slug: "van-thinh-phat-2022",
    title: "Vạn Thịnh Phát: Vụ Án Ngàn Tỷ Việt Nam",
    subtitle: "Vụ lừa đảo trái phiếu lớn nhất lịch sử Việt Nam — thiệt hại 304.000 tỷ đồng",
    year: 2022,
    country: "Vietnam",
    countryFlag: "🇻🇳",
    sector: "Bất động sản / Ngân hàng",
    damage: "304.000 tỷ VNĐ (~12 tỷ USD)",
    damageValue: 12000000000,
    damageVND: "304.000 tỷ VNĐ",
    severity: "critical",
    featured: true,
    icon: "🏢",
    categories: ["trai-phieu", "bat-dong-san", "ngan-hang"],
    standards: ["VSA 240", "VSA 505", "VSA 550", "ISA 570"],
    trickShort: "Phát hành trái phiếu 'ma' qua công ty bình phong, rút tiền SCB để phục vụ lợi ích cá nhân",
    views: 23560,
    comments: 156,
    timeline: {
      context: "Trương Mỹ Lan — Chủ tịch Tập đoàn Vạn Thịnh Phát — kiểm soát thực tế Ngân hàng SCB thông qua sở hữu chéo phức tạp với hơn 1.000 công ty vỏ bọc. SCB là ngân hàng tư nhân lớn (top 3 về tổng tài sản tại Việt Nam). Cơ chế sở hữu chéo tạo ra 'ốc đảo quyền lực' không bị kiểm soát.",
      trick: "Vạn Thịnh Phát phát hành trái phiếu doanh nghiệp thông qua 4 công ty bình phong (An Đông, Sunny World, Setra, Quang Thuận) với lãi suất hấp dẫn 8-9%/năm. Nhân viên SCB môi giới trái phiếu cho khách hàng gửi tiết kiệm như 'sản phẩm an toàn'. Tiền huy động được rút ra thông qua hàng nghìn khoản vay khống, không có tài sản đảm bảo thực sự. Thẩm định tài sản bất động sản bị nâng khống lên gấp 10-20 lần giá trị thực để đủ điều kiện vay.",
      audit_failure: "Kiểm toán độc lập và NHNN giám sát đã bỏ qua hoặc không phát hiện: (1) Mạng lưới sở hữu chéo phức tạp vi phạm quy định giới hạn sở hữu ngân hàng; (2) Tập trung tín dụng cực lớn vào một nhóm khách hàng liên quan; (3) Giá trị tài sản đảm bảo bị thổi phồng; (4) Dòng tiền trái phiếu không được theo dõi mục đích sử dụng. VSA 550 về Các bên liên quan không được áp dụng hiệu quả.",
      consequence: "Trương Mỹ Lan bị bắt tháng 10/2022. Phiên xét xử 2024: tử hình (sau giảm xuống chung thân do bồi thường). SCB được nhà nước kiểm soát đặc biệt. Hàng chục nghìn nhà đầu tư trái phiếu cá nhân mất trắng tiền tiết kiệm. Đây là cú sốc gây đình trệ toàn bộ thị trường trái phiếu doanh nghiệp Việt Nam 2022-2023."
    },
    lessons: [
      "Kiểm toán PHẢI nhận diện và đánh giá mạng lưới các bên liên quan phức tạp (VSA 550)",
      "Xác minh độc lập giá trị tài sản đảm bảo bất động sản — không tin vào thẩm định của đơn vị liên quan (VSA 505)",
      "Tập trung tín dụng cho một nhóm khách hàng là rủi ro trọng yếu cần ghi nhận (VSA 315)",
      "Kiểm toán viên cần hiểu cấu trúc sở hữu thực tế, không chỉ sở hữu danh nghĩa"
    ],
    downloads: [
      { name: "Sơ đồ mạng lưới Vạn Thịnh Phát - SCB", type: "PDF", size: "4.1 MB", free: true },
      { name: "Checklist phát hiện sở hữu chéo ngân hàng", type: "XLSX", size: "145 KB", free: false }
    ]
  },
  {
    id: "theranos-2018",
    slug: "theranos-2018",
    title: "Theranos: Lừa Đảo Silicon Valley",
    subtitle: "Startup y tế trị giá $9 tỷ với công nghệ xét nghiệm máu không tồn tại",
    year: 2018,
    country: "USA",
    countryFlag: "🇺🇸",
    sector: "Healthcare / Biotech",
    damage: "$9 tỷ USD (định giá gian lận)",
    damageValue: 9000000000,
    damageVND: null,
    severity: "high",
    featured: true,
    icon: "🧪",
    categories: ["tai-san-vo-hinh", "doanh-thu-ao"],
    standards: ["ISA 240", "ISA 540", "ISA 500"],
    trickShort: "Tuyên bố sai về công nghệ xét nghiệm máu cách mạng để huy động vốn $700M từ nhà đầu tư",
    views: 8920,
    comments: 43,
    timeline: {
      context: "Elizabeth Holmes bỏ học Stanford năm 19 tuổi để thành lập Theranos năm 2003 với tuyên bố: chỉ cần 1 giọt máu từ đầu ngón tay có thể thực hiện 200+ xét nghiệm bệnh lý với giá rẻ. Theranos được định giá $9 tỷ, Holmes trở thành nữ tỷ phú tự thân trẻ nhất nước Mỹ và lên bìa Forbes, Fortune, Time.",
      trick: "Công nghệ Edison của Theranos thực tế không hoạt động như tuyên bố — kết quả xét nghiệm cực kỳ không chính xác và nguy hiểm cho bệnh nhân. Để đối phó, Theranos âm thầm sử dụng máy xét nghiệm thương mại của Siemens và Abbott cho 80% mẫu xét nghiệm trong khi vẫn tuyên bố dùng công nghệ độc quyền. Holmes duy trì bí mật công nghệ bằng cách yêu cầu tất cả nhân viên ký NDA cực kỳ chặt chẽ và không cho phép kiểm toán kỹ thuật độc lập.",
      audit_failure: "Theranos là công ty tư nhân nên không bắt buộc kiểm toán độc lập công khai. Các nhà đầu tư (Rupert Murdoch, Betsy DeVos, Walgreens) rót tiền dựa trên uy tín cá nhân Holmes và Hội đồng quản trị 'bình phong' gồm cựu quan chức cấp cao nhưng không có chuyên môn y tế. Không có thẩm định kỹ thuật (technical due diligence) độc lập về công nghệ được thực hiện.",
      consequence: "Phóng viên John Carreyrou (WSJ) phá vụ năm 2015 sau khi nhận tố cáo từ nội bộ. FDA và CMS đóng cửa phòng lab Theranos 2016. Elizabeth Holmes bị kết án 11 năm tù liên bang (2022). Chồng cũ Ramesh 'Sunny' Balwani 13 năm tù. Hàng trăm nghìn bệnh nhân có thể đã nhận kết quả xét nghiệm sai và được điều trị không đúng."
    },
    lessons: [
      "Due diligence kỹ thuật độc lập là bắt buộc trước khi đầu tư vào công ty công nghệ (ISA 500)",
      "Thiếu minh bạch về 'bí quyết công nghệ' là dấu hiệu đỏ (red flag) nghiêm trọng",
      "Hội đồng quản trị cần có chuyên gia ngành, không chỉ là người có danh tiếng (VSA 315)",
      "Kiểm toán viên phải xác minh doanh thu thực tế từ bên thứ ba độc lập (ISA 240)"
    ],
    downloads: [
      { name: "Red flags checklist - Startup fraud detection", type: "XLSX", size: "88 KB", free: true }
    ]
  },
  {
    id: "toshiba-2015",
    slug: "toshiba-2015",
    title: "Toshiba: Thổi Phồng Lợi Nhuận ¥152 Tỷ",
    subtitle: "Gian lận kế toán có hệ thống 7 năm dưới áp lực từ ban lãnh đạo cấp cao nhất",
    year: 2015,
    country: "Japan",
    countryFlag: "🇯🇵",
    sector: "Điện tử / Công nghiệp",
    damage: "¥152 tỷ JPY (~1,2 tỷ USD)",
    damageValue: 1200000000,
    damageVND: null,
    severity: "high",
    featured: false,
    icon: "📺",
    categories: ["doanh-thu", "chi-phi", "du-an"],
    standards: ["ISA 240", "ISA 540", "ISA 260"],
    trickShort: "Ban lãnh đạo gây áp lực toàn hệ thống thổi phồng lợi nhuận qua kế toán dự án xây dựng (POC method)",
    views: 6540,
    comments: 31,
    timeline: {
      context: "Toshiba Corporation là tập đoàn điện tử 139 năm tuổi của Nhật Bản, một trong những biểu tượng công nghiệp Nhật. Năm 2008-2014, ngành điện tử Nhật chịu sức ép cạnh tranh khốc liệt từ Samsung và LG. Ban lãnh đạo Toshiba đặt ra các mục tiêu lợi nhuận không tưởng và tạo áp lực 'không thể bị thất bại' lên các bộ phận.",
      trick: "Ba vị CEO liên tiếp (Nishida, Sasaki, Tanaka) đã tạo văn hóa 'challenge' — các bộ phận PHẢI đạt mục tiêu lợi nhuận bằng mọi cách. Kế toán dự án xây dựng (POC — Percentage of Completion) bị thao túng để ghi nhận lợi nhuận sớm hơn thực tế. Chi phí bị trì hoãn ghi nhận sang kỳ sau. Dự án lỗ được báo cáo có lãi. Gian lận diễn ra có hệ thống tại tất cả bộ phận lớn trong 7 năm (2008-2014).",
      audit_failure: "Ernst & Young ShinNihon (kiểm toán Toshiba) không phát hiện ra gian lận dù kiểm toán hàng năm. Kiểm toán viên không đặt câu hỏi đủ về áp lực ban lãnh đạo (management pressure) — một yếu tố rủi ro gian lận cơ bản trong ISA 240. Mô hình gian lận do ban lãnh đạo cao nhất chỉ đạo (tone at the top) đặc biệt khó phát hiện nếu kiểm toán viên không đủ hoài nghi.",
      consequence: "Toshiba phải điều chỉnh lại BCTC 7 năm, CEO và hội đồng quản trị từ chức hàng loạt. Cổ phiếu mất 40% giá trị. EY ShinNihon bị phạt và tạm đình chỉ hoạt động tại Nhật. Toshiba sau đó bị hủy niêm yết năm 2023 sau các cuộc tranh giành kiểm soát từ quỹ đầu tư tư nhân."
    },
    lessons: [
      "Áp lực ban lãnh đạo (management pressure / tone at the top) là yếu tố rủi ro gian lận bắt buộc đánh giá (ISA 240)",
      "Phương pháp kế toán POC cần kiểm tra độc lập tỷ lệ hoàn thành thực tế dự án",
      "Gian lận kéo dài nhiều năm thường cần sự tham gia của nhiều cấp quản lý — phỏng vấn độc lập cần thiết",
      "Kiểm toán viên phải báo cáo kịp thời cho HĐQT về nghi ngờ sai lệch (ISA 260)"
    ],
    downloads: [
      { name: "Bảng đánh giá rủi ro gian lận (Fraud Risk Matrix)", type: "XLSX", size: "134 KB", free: false }
    ]
  },
  {
    id: "parmalat-2003",
    slug: "parmalat-2003",
    title: "Parmalat: €14 Tỷ Biến Mất Như Sữa",
    subtitle: "Vụ gian lận tài chính lớn nhất châu Âu — tài khoản ngân hàng giả tại Cayman Islands",
    year: 2003,
    country: "Italy",
    countryFlag: "🇮🇹",
    sector: "Thực phẩm / FMCG",
    damage: "€14 tỷ EUR",
    damageValue: 15400000000,
    damageVND: null,
    severity: "critical",
    featured: false,
    icon: "🥛",
    categories: ["tien-mat", "tai-san-ao", "no-trai-phieu"],
    standards: ["ISA 505", "ISA 240", "ISA 600"],
    trickShort: "Tạo tài khoản ngân hàng giả tại Cayman Islands với €3,9 tỷ 'tiền mặt' để che giấu vỡ nợ",
    views: 5210,
    comments: 28,
    timeline: {
      context: "Parmalat là tập đoàn sữa Italia lớn nhất thế giới, có mặt tại 30 quốc gia với 36.000 nhân viên. Là biểu tượng công nghiệp của Italy trong nhiều thập kỷ. Calisto Tanzi — nhà sáng lập — kiểm soát công ty như đế chế gia đình.",
      trick: "Parmalat duy trì hàng loạt công ty con ngoài khơi (offshore) tại Cayman Islands, Quần đảo Virgin... để che giấu nợ. Để che đậy vỡ nợ ngày càng tăng, Parmalat tạo ra văn bản giả từ Bank of America xác nhận tài khoản €3,9 tỷ tại Cayman Islands — văn bản được làm giả bằng cách cắt dán logo ngân hàng từ tài liệu thật. Khi Bank of America xác nhận tài khoản không tồn tại năm 2003, toàn bộ bộ máy gian lận sụp đổ.",
      audit_failure: "Deloitte & Touche và Grant Thornton (hai hãng kiểm toán) đã chia sẻ kiểm toán Parmalat trong nhiều năm. Không hãng nào xác nhận trực tiếp và độc lập số dư tài khoản ngân hàng Cayman Islands. Khi nhóm kiểm toán nhận được văn bản xác nhận từ Bank of America (thực ra là giả), họ không gọi điện hoặc liên hệ trực tiếp với ngân hàng để xác minh.",
      consequence: "Parmalat phá sản tháng 12/2003 — vụ phá sản lớn nhất châu Âu lúc đó. Calisto Tanzi bị kết án 18 năm tù. Các nhà quản lý cấp cao khác lĩnh án từ 6-10 năm. Các ngân hàng như Bank of America, Citigroup bị kiện do đồng lõa trong một số giao dịch. Luật kiểm toán Châu Âu được cải cách đáng kể sau vụ này."
    },
    lessons: [
      "Xác nhận ngân hàng PHẢI được thực hiện trực tiếp qua đường bưu điện hoặc điện thoại độc lập — KHÔNG qua email từ khách hàng (ISA 505)",
      "Kiểm toán viên phụ trách phải giám sát và thẩm tra công việc của nhóm kiểm toán công ty con (ISA 600)",
      "Cấu trúc offshore phức tạp là dấu hiệu đỏ đòi hỏi thủ tục kiểm toán mở rộng",
      "Tài liệu giả mạo có thể được phát hiện bằng xác nhận trực tiếp nhiều kênh"
    ],
    downloads: [
      { name: "Quy trình xác nhận ngân hàng độc lập chuẩn ISA 505", type: "PDF", size: "680 KB", free: true }
    ]
  },
  {
    id: "saigoncoop-2023",
    slug: "saigoncoop-2023",
    title: "Saigon Co.op: Hàng Tồn Kho Không Cánh Mà Bay",
    subtitle: "Gian lận hàng tồn kho tại chuỗi siêu thị lớn nhất miền Nam Việt Nam",
    year: 2023,
    country: "Vietnam",
    countryFlag: "🇻🇳",
    sector: "Bán lẻ / FMCG",
    damage: "~500 tỷ VNĐ",
    damageValue: 20000000,
    damageVND: "~500 tỷ VNĐ",
    severity: "high",
    featured: false,
    icon: "🛒",
    categories: ["hang-ton-kho", "noi-bo"],
    standards: ["VSA 501", "VSA 240", "VSA 315"],
    trickShort: "Gian lận trong quản lý hàng tồn kho tại hệ thống siêu thị thông qua giao dịch giả và chiết khấu bất hợp lệ",
    views: 7890,
    comments: 47,
    timeline: {
      context: "Liên hiệp Hợp tác xã Thương mại TP. HCM (Saigon Co.op) là hệ thống bán lẻ lớn nhất miền Nam với hơn 800 điểm bán Co.opmart, Co.opXtra, Cheers... Đây là đơn vị kinh tế tập thể lớn nhất Việt Nam với doanh thu hàng chục nghìn tỷ đồng mỗi năm.",
      trick: "Sai phạm chủ yếu liên quan đến: (1) Hàng tồn kho ảo — ghi nhận hàng nhập kho nhưng thực tế không nhập hoặc số lượng thấp hơn; (2) Chiết khấu từ nhà cung cấp bị giữ lại không ghi nhận đúng sổ sách; (3) Giao dịch giữa các đơn vị liên quan trong hệ thống không theo giá thị trường; (4) Mất kiểm soát kiểm kê hàng tồn kho thực tế tại các điểm bán.",
      audit_failure: "Kiểm toán nội bộ và kiểm toán độc lập không thực hiện kiểm kê hàng tồn kho đột xuất (surprise count) tại đủ số điểm bán. Hệ thống quản lý kho phụ thuộc hoàn toàn vào dữ liệu phần mềm mà không có đối chiếu thực tế định kỳ. Quản lý bán lẻ phân tán với 800+ điểm bán tạo ra lỗ hổng kiểm soát nội bộ nghiêm trọng.",
      consequence: "Cơ quan điều tra vào cuộc năm 2023, nhiều lãnh đạo cấp cao bị bắt tạm giam. Ban lãnh đạo mới được chỉ định. Saigon Co.op phải rà soát toàn bộ quy trình quản lý hàng tồn kho và kiểm soát nội bộ. Vụ việc làm dấy lên lo ngại về quản trị tại các đơn vị kinh tế tập thể lớn."
    },
    lessons: [
      "Kiểm kê hàng tồn kho tại bán lẻ cần phương pháp cycle count và surprise count, không chỉ kiểm kê định kỳ (VSA 501)",
      "Hệ thống ERP/phần mềm kho không thể thay thế kiểm tra vật lý thực tế",
      "Chiết khấu từ nhà cung cấp phải được theo dõi và ghi nhận đầy đủ (VSA 315)",
      "Rủi ro gian lận tại đơn vị phân tán nhiều điểm cần thủ tục kiểm soát phân tầng"
    ],
    downloads: [
      { name: "Template kiểm kê hàng tồn kho bán lẻ VSA 501", type: "XLSX", size: "156 KB", free: true }
    ]
  }
];

/* ── Filter & Search Engine ───────────────────────────────── */
const CaseEngine = {
  all: [...CASES_DB],
  filtered: [...CASES_DB],

  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this;
    this.filtered = this.filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.trickShort.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.standards.some(s => s.toLowerCase().includes(q)) ||
      c.categories.some(cat => cat.toLowerCase().includes(q))
    );
    return this;
  },

  filterByCategory(categories) {
    if (!categories || categories.length === 0) return this;
    this.filtered = this.filtered.filter(c =>
      categories.some(cat => c.categories.includes(cat))
    );
    return this;
  },

  filterByCountry(countries) {
    if (!countries || countries.length === 0) return this;
    this.filtered = this.filtered.filter(c => countries.includes(c.country));
    return this;
  },

  filterBySeverity(severities) {
    if (!severities || severities.length === 0) return this;
    this.filtered = this.filtered.filter(c => severities.includes(c.severity));
    return this;
  },

  filterByYear(yearRange) {
    if (!yearRange) return this;
    const [min, max] = yearRange;
    this.filtered = this.filtered.filter(c => c.year >= min && c.year <= max);
    return this;
  },

  filterByStandard(standards) {
    if (!standards || standards.length === 0) return this;
    this.filtered = this.filtered.filter(c =>
      standards.some(s => c.standards.includes(s))
    );
    return this;
  },

  sortBy(method) {
    switch (method) {
      case 'year-desc':
        this.filtered.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        this.filtered.sort((a, b) => a.year - b.year);
        break;
      case 'damage-desc':
        this.filtered.sort((a, b) => b.damageValue - a.damageValue);
        break;
      case 'views-desc':
        this.filtered.sort((a, b) => b.views - a.views);
        break;
      case 'comments-desc':
        this.filtered.sort((a, b) => b.comments - a.comments);
        break;
    }
    return this;
  },

  reset() {
    this.filtered = [...this.all];
    return this;
  },

  getById(id) {
    return this.all.find(c => c.id === id || c.slug === id);
  },

  getFeatured() {
    return this.all.filter(c => c.featured);
  },

  getResults() {
    return [...this.filtered];
  },

  getStats() {
    const total = this.all.length;
    const totalDamage = this.all.reduce((sum, c) => sum + c.damageValue, 0);
    const countries = [...new Set(this.all.map(c => c.country))].length;
    const totalComments = this.all.reduce((sum, c) => sum + c.comments, 0);
    return { total, totalDamage, countries, totalComments };
  }
};

/* ── localStorage: Load custom cases added via Admin ──────── */
function loadCustomCases() {
  try {
    const custom = JSON.parse(localStorage.getItem('thamtu_cases') || '[]');
    custom.forEach(c => {
      if (!CaseEngine.all.find(existing => existing.id === c.id)) {
        CaseEngine.all.unshift(c);
        CaseEngine.filtered.unshift(c);
      }
    });
  } catch (e) {
    console.warn('Could not load custom cases:', e);
  }
}

/* ── Render Case Card HTML ────────────────────────────────── */
function renderCaseCard(c, detailed = false) {
  const severityColors = {
    critical: '#ff4444', high: '#ff8c00', medium: '#d4a017', low: '#4ade80'
  };
  const severityLabels = {
    critical: 'Nghiêm trọng', high: 'Cao', medium: 'Trung bình', low: 'Thấp'
  };

  const CLASSIC_IDS = ['enron-2001','worldcom-2002','parmalat-2003','wirecard-2020'];
  const isClassic = CLASSIC_IDS.includes(c.id);
  const classicBadge = isClassic ? `<span class="badge badge-vip" style="font-size:0.65rem;padding:2px 8px;">⭐ VIP</span>` : '';

  // Build click handler: check auth then navigate
  const clickFn = `handleCaseClick('${c.id}', ${isClassic})`;

  return `
    <div class="card case-card card-tilt reveal" onclick="${clickFn}" style="cursor:pointer;">
      <div class="case-card-inner">
        <div class="case-card-top">
          <div class="case-card-meta">
            <div class="flex items-center gap-2">
              <span class="text-xl">${c.icon}</span>
              <span class="badge badge-blue text-xs">${c.year}</span>
              <span class="text-xs">${c.countryFlag}</span>
              ${classicBadge}
            </div>
            <div class="flex items-center gap-2">
              <span class="severity-dot ${c.severity}"></span>
              <span class="text-xs text-muted">${severityLabels[c.severity]}</span>
            </div>
          </div>
          <h3 class="case-card-title">${c.title}</h3>
          <p class="case-card-trick">${c.trickShort}</p>
          <div class="case-card-standards">
            ${c.standards.slice(0, 3).map(s => `<span class="badge badge-red">${s}</span>`).join('')}
            ${c.standards.length > 3 ? `<span class="badge badge-red">+${c.standards.length - 3}</span>` : ''}
          </div>
        </div>
        <div class="case-card-footer">
          <div>
            <div class="case-damage-label">Thiệt hại ước tính</div>
            <div class="case-damage-value">${c.damageVND || c.damage}</div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-muted">💬 ${c.comments}</span>
            <div class="case-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global click handler for case cards — checks auth & VIP before navigating
function handleCaseClick(caseId, isClassic) {
  if (typeof AUTH === 'undefined') { window.location.href = `case-detail.html?id=${caseId}`; return; }
  const s = AUTH.getSession();
  if (!s) { AUTH.showLoginGate('view_case'); return; }
  if (isClassic && !s.vip && s.role !== 'admin') { AUTH.showLoginGate('view_classic'); return; }
  window.location.href = `case-detail.html?id=${caseId}`;
}

// Load custom cases when script loads
loadCustomCases();
