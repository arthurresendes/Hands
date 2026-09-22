import React, { useEffect } from "react";
import logo from "../assets/logo.png";

const styles = {
    page: {
        fontFamily: "'Inter', sans-serif", color: "#14121F", background: "#fff",
        width: "100%", margin: 0, padding: 0, overflowX: "hidden",
    },

    header: { background: "#5B2EFF", position: "sticky", top: 0, zIndex: 100 },
    headerInner: {
        maxWidth: 1120, margin: "0 auto", padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    logoImg: { height: 38, width: "auto" },
    nav: { display: "flex", gap: 32 },
    navLink: { color: "#fff", fontWeight: 500, fontSize: 15, opacity: 0.92, textDecoration: "none" },
    headerCta: { display: "flex", gap: 12 },
    btnOutlineWhite: {
        border: "1.5px solid rgba(255,255,255,0.6)", color: "#fff", padding: "9px 18px",
        borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none",
    },
    btnYellowSmall: {
        background: "#FFC431", color: "#241a00", padding: "9px 18px",
        borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none",
    },

    hero: {
        background: "linear-gradient(160deg, #6B3CFF 0%, #4620CC 100%)",
        color: "#fff", padding: "56px 24px 90px", textAlign: "center",
    },
    badge: {
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.14)", borderRadius: 999,
        padding: "8px 18px", fontSize: 13, fontWeight: 500, marginBottom: 28,
    },
    dot: { width: 7, height: 7, borderRadius: "50%", background: "#FFC431" },
    h1: {
        fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 800, lineHeight: 1.15,
        letterSpacing: "-0.5px", maxWidth: 720, margin: "0 auto 20px",
    },
    accent: { color: "#FFC431" },
    heroSub: {
        fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.85)",
        maxWidth: 560, margin: "0 auto 32px",
    },
    searchCard: {
        background: "#fff", borderRadius: 20, padding: 22,
        maxWidth: 560, margin: "0 auto", boxShadow: "0 20px 40px rgba(20,10,60,0.25)", textAlign: "left",
    },
    searchInput: {
        width: "100%", border: "1px solid #E5E7EB", borderRadius: 12,
        padding: "14px 16px", fontSize: 15, fontFamily: "inherit", color: "#14121F",
        marginBottom: 14, background: "#F9FAFB", boxSizing: "border-box",
    },
    searchBtn: {
        width: "100%", background: "#5B2EFF", color: "#fff", fontWeight: 700,
        fontSize: 15, padding: 15, borderRadius: 12, border: "none", cursor: "default",
    },
    heroStats: {
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "28px 40px",
        marginTop: 36, fontSize: 14, fontWeight: 500,
    },
    heroStatItem: { display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.9)" },

    section: { padding: "72px 24px" },
    sectionGray: { padding: "72px 24px", background: "#F3F4F6" },
    eyebrow: {
        display: "block", textAlign: "center", color: "#5B2EFF", fontWeight: 700,
        fontSize: 13, letterSpacing: "0.06em", marginBottom: 10,
    },
    h2: {
        fontFamily: "'Outfit', sans-serif", textAlign: "center", fontSize: 34, fontWeight: 800,
        letterSpacing: "-0.3px", maxWidth: 640, margin: "0 auto 12px", lineHeight: 1.25,
    },
    sectionSub: {
        textAlign: "center", color: "#6B7280", fontSize: 15.5,
        maxWidth: 520, margin: "0 auto 48px",
    },

    stepsGrid: {
        display: "grid", gap: 24, maxWidth: 1080, margin: "0 auto",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    },
    stepCard: {
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18,
        padding: "32px 26px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    },
    stepTop: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
    stepNum: { fontSize: 30, fontWeight: 800, color: "#E4DBFF", fontFamily: "'Outfit', sans-serif" },
    stepIcon: {
        width: 42, height: 42, borderRadius: 12, background: "#F3F1FF",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#5B2EFF",
    },
    stepH3: { fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 },
    stepP: { fontSize: 14.5, color: "#6B7280", lineHeight: 1.55 },

    catGrid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 18, maxWidth: 960, margin: "0 auto",
    },
    catCard: {
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
        padding: "26px 18px", textAlign: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    },
    catIcon: {
        width: 52, height: 52, margin: "0 auto 16px", borderRadius: 14,
        background: "#F3F1FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B2EFF",
        fontSize: 22,
    },
    catH4: { fontFamily: "'Outfit', sans-serif", fontSize: 15.5, fontWeight: 700, marginBottom: 4 },
    catSpan: { fontSize: 13, color: "#6B7280" },

    prosHead: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1080, margin: "0 auto 40px", flexWrap: "wrap", gap: 12,
    },
    btnOutlinePurple: {
        border: "1.5px solid #5B2EFF", color: "#5B2EFF", fontWeight: 600,
        padding: "11px 22px", borderRadius: 10, fontSize: 14, whiteSpace: "nowrap", textDecoration: "none",
    },
    prosGrid: {
        display: "grid", gap: 24, maxWidth: 1080, margin: "0 auto",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    proCard: {
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18, overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    proPhoto: { position: "relative", height: 220, background: "#ddd" },
    proPhotoImg: { width: "100%", height: "100%", objectFit: "cover" },
    proTag: {
        position: "absolute", top: 14, left: 14, background: "#fff", color: "#5B2EFF",
        fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 999,
    },
    proBody: { padding: "20px 22px 24px" },
    proH4: { fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 3 },
    proRole: { fontSize: 13.5, color: "#6B7280", marginBottom: 10 },
    proRating: { display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, marginBottom: 6 },
    stars: { color: "#FFC431", letterSpacing: 1 },
    proLoc: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
    btnPurpleFull: {
        display: "block", textAlign: "center", background: "#5B2EFF", color: "#fff",
        fontWeight: 700, padding: 12, borderRadius: 10, fontSize: 14.5, textDecoration: "none",
    },

    diffGrid: {
        display: "grid", gap: 20, maxWidth: 1080, margin: "0 auto",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    },
    diffCard: {
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
        padding: "28px 22px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    },
    diffIcon: (bg, color) => ({
        width: 46, height: 46, borderRadius: 12, marginBottom: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: bg, color: color, fontSize: 20,
    }),
    diffH4: { fontFamily: "'Outfit', sans-serif", fontSize: 16.5, fontWeight: 700, marginBottom: 8 },
    diffP: { fontSize: 14, color: "#6B7280", lineHeight: 1.55 },

    revSummary: {
        background: "linear-gradient(160deg,#6B3CFF,#4620CC)", color: "#fff", borderRadius: 22,
        maxWidth: 1080, margin: "0 auto 40px", padding: "44px 28px", textAlign: "center",
    },
    revScore: { fontSize: 56, fontWeight: 800, fontFamily: "'Outfit', sans-serif" },
    revStars: { color: "#FFC431", fontSize: 20, letterSpacing: 3, margin: "8px 0" },
    revOf5: { fontSize: 14, opacity: 0.85, marginBottom: 2 },
    revCount: { fontSize: 13, opacity: 0.7, marginBottom: 28 },
    bars: { maxWidth: 640, margin: "0 auto", textAlign: "left", display: "grid", gap: 14 },
    barRow: { display: "grid", gridTemplateColumns: "150px 1fr 42px", alignItems: "center", gap: 14, fontSize: 13.5 },
    barTrack: { height: 8, background: "rgba(255,255,255,0.18)", borderRadius: 99, overflow: "hidden" },
    barFill: (w) => ({ height: "100%", width: w, background: "#fff", borderRadius: 99 }),

    revStats: { display: "flex", justifyContent: "center", gap: 16, maxWidth: 1080, margin: "0 auto 40px", flexWrap: "wrap" },
    revStat: {
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
        padding: "26px 34px", textAlign: "center", flex: 1, minWidth: 150, maxWidth: 220,
    },
    revStatBig: { fontSize: 22, fontWeight: 800, fontFamily: "'Outfit', sans-serif" },
    revStatLbl: { fontSize: 12.5, color: "#6B7280", marginTop: 2 },

    reviewsGrid: {
        display: "grid", gap: 20, maxWidth: 1080, margin: "0 auto",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    },
    reviewCard: { background: "#F3F1FF", borderRadius: 16, padding: "24px 26px" },
    reviewQuote: { fontSize: 14.5, lineHeight: 1.6, color: "#2b2540", margin: "10px 0 18px" },
    reviewUser: { display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", flexWrap: "wrap" },
    reviewWho: { display: "flex", alignItems: "center", gap: 10 },
    reviewAvatar: { width: 38, height: 38, borderRadius: "50%", objectFit: "cover" },
    reviewName: { fontSize: 14, fontWeight: 700 },
    reviewLoc: { fontSize: 12, color: "#6B7280" },
    reviewBadge: {
        fontSize: 11.5, fontWeight: 600, background: "#fff", color: "#5B2EFF",
        padding: "5px 11px", borderRadius: 999, whiteSpace: "nowrap",
    },

    workWrap: {
        maxWidth: 1080, margin: "0 auto", display: "grid", gap: 40,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "center",
    },
    workPhoto: { position: "relative", borderRadius: 20, overflow: "hidden" },
    workPhotoImg: { width: "100%", height: 340, objectFit: "cover" },
    workFloat: {
        position: "absolute", bottom: 18, left: 18, background: "rgba(20,18,31,0.85)",
        color: "#fff", borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10,
    },
    workAvatar: {
        width: 36, height: 36, borderRadius: "50%", background: "#5B2EFF",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    workContentH2: { fontFamily: "'Outfit', sans-serif", textAlign: "left", fontSize: 30, marginBottom: 6, fontWeight: 800 },
    workContentH3: { fontFamily: "'Outfit', sans-serif", fontSize: 19, color: "#5B2EFF", fontWeight: 700, marginBottom: 16 },
    workContentP: { color: "#6B7280", fontSize: 15, lineHeight: 1.6, marginBottom: 22 },
    workList: { display: "grid", gap: 14, marginBottom: 28, listStyle: "none", padding: 0 },
    workListItem: { display: "flex", alignItems: "center", gap: 12, fontSize: 14.5, fontWeight: 500 },
    check: {
        width: 22, height: 22, borderRadius: "50%", background: "#FFF3D6", color: "#D99A00",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0,
    },
    btnYellowFull: {
        display: "inline-block", background: "#FFC431", color: "#241a00", fontWeight: 700,
        padding: "14px 28px", borderRadius: 12, fontSize: 15, textDecoration: "none",
    },

    faqList: { maxWidth: 760, margin: "0 auto", display: "grid", gap: 14 },
    faqItem: {
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
        padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    },
    faqQ: { fontSize: 15, fontWeight: 600 },
    faqPlus: {
        width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #E5E7EB",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280",
        flexShrink: 0, fontSize: 16,
    },

    finalCta: { background: "#14121F", color: "#fff", textAlign: "center", padding: "80px 24px" },
    finalCtaH2: { fontFamily: "'Outfit', sans-serif", color: "#fff", fontSize: 32, marginBottom: 14, fontWeight: 800 },
    finalCtaP: {
        color: "rgba(255,255,255,0.65)", fontSize: 15.5, marginBottom: 34,
        maxWidth: 480, marginLeft: "auto", marginRight: "auto",
    },
    finalBtns: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
    btnPurpleLg: {
        background: "#5B2EFF", color: "#fff", fontWeight: 700, padding: "15px 34px",
        borderRadius: 12, fontSize: 15.5, textDecoration: "none",
    },
    btnGhostLg: {
        background: "transparent", color: "#fff", fontWeight: 600, padding: "15px 34px",
        borderRadius: 12, fontSize: 15, border: "1.5px solid rgba(255,255,255,0.25)", textDecoration: "none",
    },

    footer: { background: "#181622", color: "rgba(255,255,255,0.7)", padding: "64px 24px 28px" },
    footerTop: {
        maxWidth: 1120, margin: "0 auto", display: "grid", gap: 40, marginBottom: 48,
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    },
    footerBrandImg: { height: 34, marginBottom: 14 },
    footerBrandP: { fontSize: 13.5, lineHeight: 1.6, maxWidth: 280, marginBottom: 20 },
    socialRow: { display: "flex", gap: 10 },
    socialLink: {
        width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, textDecoration: "none",
    },
    footerColH5: { color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 18, fontFamily: "'Outfit', sans-serif" },
    footerColUl: { listStyle: "none", display: "grid", gap: 12, padding: 0 },
    footerColA: { fontSize: 13.5, color: "rgba(255,255,255,0.7)", textDecoration: "none" },
    footerBottom: {
        maxWidth: 1120, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between",
        fontSize: 12.5, color: "rgba(255,255,255,0.45)",
    },
};

const categories = [
    { icon: "⚡", name: "Eletricista", count: "1.240 profissionais" },
    { icon: "💧", name: "Encanador", count: "890 profissionais" },
    { icon: "🎨", name: "Pintor", count: "1.150 profissionais" },
    { icon: "🧹", name: "Diarista", count: "2.100 profissionais" },
    { icon: "🔨", name: "Pedreiro", count: "940 profissionais" },
    { icon: "🌿", name: "Jardineiro", count: "670 profissionais" },
    { icon: "🖥️", name: "Técnico de TI", count: "530 profissionais" },
    { icon: "🔧", name: "Montador", count: "880 profissionais" },
];

const pros = [
    {
        img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
        tag: "✓ Verificado", name: "Marcos Silva", role: "Eletricista Residencial",
        rating: "4.9", count: "142 avaliações", loc: "São Paulo, SP",
    },
    {
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        tag: "✓ Top Avaliada", name: "Ana Paula Costa", role: "Diarista & Organizadora",
        rating: "5", count: "98 avaliações", loc: "São Paulo, SP",
    },
    {
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        tag: "✓ Verificado", name: "Ricardo Souza", role: "Encanador Hidráulico",
        rating: "4.8", count: "210 avaliações", loc: "Guarulhos, SP",
    },
];

const differentials = [
    { icon: "📍", bg: "#EFEAFF", color: "#5B2EFF", title: "Localização Facilitada", text: "Encontre profissionais próximos buscando diretamente pelo CEP." },
    { icon: "⭐", bg: "#FFF3D6", color: "#D99A00", title: "Avaliações Reais", text: "Somente clientes que contrataram podem avaliar o serviço." },
    { icon: "💬", bg: "#E4F8EC", color: "#1E9E52", title: "Contato via WhatsApp", text: "Converse diretamente com o profissional sem intermediários." },
    { icon: "💼", bg: "#FFE8E0", color: "#E0562C", title: "Perfis Completos", text: "Veja fotos, preços base, formas de pagamento e certificados." },
];

const ratingBars = [
    { label: "Facilidade de uso", value: 96 },
    { label: "Qualidade dos profissionais", value: 93 },
    { label: "Rapidez no atendimento", value: 91 },
    { label: "Confiabilidade da plataforma", value: 95 },
    { label: "Custo-benefício", value: 94 },
];

const reviews = [
    {
        quote: "\u201CA plataforma é muito intuitiva. Em menos de 5 minutos achei um pintor disponível na minha rua. Nunca foi tão fácil!\u201D",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        name: "Beatriz Carvalho", loc: "São Paulo, SP", badge: "Cliente verificado",
    },
    {
        quote: "\u201CFinalmente um app que respeita tanto o cliente quanto o profissional. Sem taxas abusivas e contato direto. Perfeito!\u201D",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        name: "Roberto Nascimento", loc: "Guarulhos, SP", badge: "Usuário desde 2025",
    },
    {
        quote: "\u201CMeu negócio de eletricidade cresceu muito depois que entrei no Hands. Recebo contatos todos os dias sem pagar nada.\u201D",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
        name: "Eduardo Fonseca", loc: "ABC Paulista, SP", badge: "Prestador verificado",
    },
    {
        quote: "\u201CO processo de verificação dos profissionais me dá muita segurança. Já contratei 4 vezes e sempre fui bem atendida.\u201D",
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
        name: "Fernanda Lopes", loc: "Campinas, SP", badge: "Cliente verificado",
    },
];

const faqs = [
    "Como funciona o Hands?",
    "É realmente gratuito?",
    "Como me cadastro como prestador de serviços?",
    "Como entro em contato com um profissional?",
];

export default function HandsLandingPage() {
    useEffect(() => {
        // Remove a margem padrão que o navegador aplica no <html>/<body>,
        // que é a causa das faixas brancas nas laterais.
        const prevHtmlMargin = document.documentElement.style.margin;
        const prevBodyMargin = document.body.style.margin;
        const prevBodyPadding = document.body.style.padding;
        const prevHtmlWidth = document.documentElement.style.width;
        const prevBodyWidth = document.body.style.width;

        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.documentElement.style.width = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.width = "100%";
        document.body.style.boxSizing = "border-box";

        return () => {
            document.documentElement.style.margin = prevHtmlMargin;
            document.documentElement.style.width = prevHtmlWidth;
            document.body.style.margin = prevBodyMargin;
            document.body.style.padding = prevBodyPadding;
            document.body.style.width = prevBodyWidth;
        };
    }, []);

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <img src={logo} alt="Hands" style={styles.logoImg} />
                    <nav style={styles.nav} className="desktop-only">
                        <a href="#" style={styles.navLink}>Como funciona</a>
                        <a href="#" style={styles.navLink}>Categorias</a>
                        <a href="#" style={styles.navLink}>Profissionais</a>
                        <a href="#" style={styles.navLink}>Diferenciais</a>
                        <a href="#" style={styles.navLink}>FAQ</a>
                    </nav>
                    <div style={styles.headerCta} className="desktop-only">
                        <a href="#" style={styles.btnOutlineWhite}>Cadastrar como Profissional</a>
                        <a href="#" style={styles.btnYellowSmall}>Buscar Profissional</a>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.badge}>
                    <span style={styles.dot}></span> +5.000 profissionais verificados disponíveis
                </div>
                <h1 style={styles.h1}>
                    O profissional ideal para o seu projeto,{" "}
                    <span style={styles.accent}>a um clique.</span>
                </h1>
                <p style={styles.heroSub}>
                    Conectamos você aos melhores prestadores de serviços manuais e
                    profissionais locais de forma rápida, segura e sem custo.
                </p>
                <div style={styles.searchCard}>
                    <input style={styles.searchInput} type="text" placeholder="Qual serviço você precisa?" disabled />
                    <input style={styles.searchInput} type="text" placeholder="Digite seu CEP" disabled />
                    <button style={styles.searchBtn} type="button">Buscar</button>
                </div>
                <div style={styles.heroStats}>
                    <span style={styles.heroStatItem}>👥 +5.000 profissionais</span>
                    <span style={styles.heroStatItem}>⭐ Avaliações verificadas</span>
                    <span style={styles.heroStatItem}>🛡️ 100% grátis para clientes</span>
                </div>
            </section>

            {/* STEPS */}
            <section style={styles.section}>
                <span style={styles.eyebrow}>PASSO A PASSO</span>
                <h2 style={styles.h2}>Três passos para resolver o seu problema</h2>
                <div style={styles.stepsGrid}>
                    {[
                        { n: "01", icon: "🔍", title: "Busque o serviço", text: "Informe o tipo de serviço que você precisa e sua localização para encontrarmos os melhores profissionais próximos." },
                        { n: "02", icon: "👥", title: "Compare perfis", text: "Veja avaliações, fotos de trabalhos anteriores, preços médios e reputação do profissional antes de decidir." },
                        { n: "03", icon: "💬", title: "Contrate direto", text: "Negocie condições e agende a execução diretamente pelo WhatsApp, sem intermediários ou taxas." },
                    ].map((s) => (
                        <div style={styles.stepCard} key={s.n}>
                            <div style={styles.stepTop}>
                                <span style={styles.stepNum}>{s.n}</span>
                                <span style={styles.stepIcon}>{s.icon}</span>
                            </div>
                            <h3 style={styles.stepH3}>{s.title}</h3>
                            <p style={styles.stepP}>{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORIES */}
            <section style={styles.sectionGray}>
                <span style={styles.eyebrow}>EXPLORE</span>
                <h2 style={styles.h2}>Explore por áreas</h2>
                <p style={styles.sectionSub}>As categorias mais buscadas do Hands</p>
                <div style={styles.catGrid}>
                    {categories.map((c) => (
                        <div style={styles.catCard} key={c.name}>
                            <div style={styles.catIcon}>{c.icon}</div>
                            <h4 style={styles.catH4}>{c.name}</h4>
                            <span style={styles.catSpan}>{c.count}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED PROS */}
            <section style={styles.section}>
                <div style={styles.prosHead}>
                    <div>
                        <span style={{ ...styles.eyebrow, textAlign: "left" }}>QUALIDADE GARANTIDA</span>
                        <h2 style={{ ...styles.h2, textAlign: "left", margin: "0 0 6px" }}>Profissionais em destaque</h2>
                        <p style={{ color: "#6B7280", fontSize: 15, margin: 0 }}>na sua região</p>
                    </div>
                    <a href="#" style={styles.btnOutlinePurple}>Ver todos</a>
                </div>
                <div style={styles.prosGrid}>
                    {pros.map((p) => (
                        <div style={styles.proCard} key={p.name}>
                            <div style={styles.proPhoto}>
                                <img src={p.img} alt={p.name} style={styles.proPhotoImg} />
                                <span style={styles.proTag}>{p.tag}</span>
                            </div>
                            <div style={styles.proBody}>
                                <h4 style={styles.proH4}>{p.name}</h4>
                                <div style={styles.proRole}>{p.role}</div>
                                <div style={styles.proRating}>
                                    <span style={styles.stars}>{"★★★★★"}</span> {p.rating}{" "}
                                    <span style={{ color: "#6B7280", fontWeight: 400 }}>({p.count})</span>
                                </div>
                                <div style={styles.proLoc}>📍 {p.loc}</div>
                                <a href="#" style={styles.btnPurpleFull}>Ver Perfil</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DIFFERENTIALS */}
            <section style={styles.sectionGray}>
                <span style={styles.eyebrow}>POR QUE O HANDS?</span>
                <h2 style={styles.h2}>Nossos Diferenciais</h2>
                <p style={styles.sectionSub}>A escolha mais segura e conveniente</p>
                <div style={styles.diffGrid}>
                    {differentials.map((d) => (
                        <div style={styles.diffCard} key={d.title}>
                            <div style={styles.diffIcon(d.bg, d.color)}>{d.icon}</div>
                            <h4 style={styles.diffH4}>{d.title}</h4>
                            <p style={styles.diffP}>{d.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* REVIEWS */}
            <section style={styles.section}>
                <span style={styles.eyebrow}>O QUE DIZEM SOBRE O HANDS</span>
                <h2 style={styles.h2}>Avaliações da Plataforma</h2>
                <p style={styles.sectionSub}>Veja a opinião de quem usa o Hands no dia a dia</p>

                <div style={styles.revSummary}>
                    <div style={styles.revScore}>4.9</div>
                    <div style={styles.revStars}>{"★★★★★"}</div>
                    <div style={styles.revOf5}>de 5.0</div>
                    <div style={styles.revCount}>+2.400 avaliações</div>
                    <div style={styles.bars}>
                        {ratingBars.map((b) => (
                            <div style={styles.barRow} key={b.label}>
                                <span>{b.label}</span>
                                <div style={styles.barTrack}>
                                    <div style={styles.barFill(b.value + "%")}></div>
                                </div>
                                <span>{b.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.revStats}>
                    <div style={styles.revStat}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>👍</div>
                        <div style={styles.revStatBig}>97%</div>
                        <div style={styles.revStatLbl}>Recomendariam</div>
                    </div>
                    <div style={styles.revStat}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>👥</div>
                        <div style={styles.revStatBig}>+12k</div>
                        <div style={styles.revStatLbl}>Usuários ativos</div>
                    </div>
                    <div style={styles.revStat}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>🏆</div>
                        <div style={styles.revStatBig}>Ótimo</div>
                        <div style={styles.revStatLbl}>Satisfação geral</div>
                    </div>
                </div>

                <div style={styles.reviewsGrid}>
                    {reviews.map((r) => (
                        <div style={styles.reviewCard} key={r.name}>
                            <div style={styles.stars}>{"★★★★★"}</div>
                            <p style={styles.reviewQuote}>{r.quote}</p>
                            <div style={styles.reviewUser}>
                                <div style={styles.reviewWho}>
                                    <img src={r.img} alt={r.name} style={styles.reviewAvatar} />
                                    <div>
                                        <div style={styles.reviewName}>{r.name}</div>
                                        <div style={styles.reviewLoc}>{r.loc}</div>
                                    </div>
                                </div>
                                <span style={styles.reviewBadge}>{r.badge}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* WORK WITH US */}
            <section style={styles.sectionGray}>
                <span style={styles.eyebrow}>PARA PROFISSIONAIS</span>
                <div style={styles.workWrap}>
                    <div style={styles.workPhoto}>
                        <img
                            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&h=500&fit=crop"
                            alt="Trabalhe conosco"
                            style={styles.workPhotoImg}
                        />
                        <div style={styles.workFloat}>
                            <div style={styles.workAvatar}>👤</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>+120 novos clientes</div>
                                <div style={{ fontSize: 11.5, opacity: 0.75 }}>nos últimos 30 dias</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 style={styles.workContentH2}>Trabalhe Conosco</h2>
                        <h3 style={styles.workContentH3}>Multiplique seus clientes</h3>
                        <p style={styles.workContentP}>
                            Crie seu perfil profissional no Hands, conquiste visibilidade na sua
                            região, receba avaliações e feche serviços sem pagar comissão.
                        </p>
                        <ul style={styles.workList}>
                            {["Cadastro rápido e gratuito", "Sem intermediários", "Negociação direta pelo WhatsApp", "Maior visibilidade nas buscas regionais"].map((t) => (
                                <li style={styles.workListItem} key={t}>
                                    <span style={styles.check}>✓</span> {t}
                                </li>
                            ))}
                        </ul>
                        <a href="#" style={styles.btnYellowFull}>Cadastre-se como Profissional</a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={styles.section}>
                <span style={styles.eyebrow}>FAQ</span>
                <h2 style={styles.h2}>Dúvidas Frequentes</h2>
                <p style={styles.sectionSub}>Perguntas mais comuns sobre o Hands</p>
                <div style={styles.faqList}>
                    {faqs.map((q) => (
                        <div style={styles.faqItem} key={q}>
                            <span style={styles.faqQ}>{q}</span>
                            <span style={styles.faqPlus}>+</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={styles.finalCta}>
                <h2 style={styles.finalCtaH2}>Pronto para resolver o seu problema?</h2>
                <p style={styles.finalCtaP}>Encontre o profissional certo a um clique de distância.</p>
                <div style={styles.finalBtns}>
                    <a href="#" style={styles.btnPurpleLg}>Buscar Profissional</a>
                    <a href="#" style={styles.btnGhostLg}>Cadastrar como Profissional</a>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <div style={styles.footerTop}>
                    <div>
                        <img src={logo} alt="Hands" style={styles.footerBrandImg} />
                        <p style={styles.footerBrandP}>
                            A maior rede de confiança para serviços locais e prestadores manuais
                            do Brasil. Facilitando conexões humanas e valorizando o trabalho local.
                        </p>
                        <div style={styles.socialRow}>
                            <a href="#" style={styles.socialLink}>📷</a>
                            <a href="#" style={styles.socialLink}>f</a>
                            <a href="#" style={styles.socialLink}>🐦</a>
                            <a href="#" style={styles.socialLink}>in</a>
                        </div>
                    </div>
                    <div>
                        <h5 style={styles.footerColH5}>PLATAFORMA</h5>
                        <ul style={styles.footerColUl}>
                            {["Como funciona", "Categorias", "Profissionais", "Diferenciais"].map((t) => (
                                <li key={t}><a href="#" style={styles.footerColA}>{t}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 style={styles.footerColH5}>SUPORTE</h5>
                        <ul style={styles.footerColUl}>
                            {["Central de Ajuda", "FAQ", "Contato", "WhatsApp"].map((t) => (
                                <li key={t}><a href="#" style={styles.footerColA}>{t}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 style={styles.footerColH5}>LEGAL</h5>
                        <ul style={styles.footerColUl}>
                            {["Termos de Uso", "Privacidade", "Cookies"].map((t) => (
                                <li key={t}><a href="#" style={styles.footerColA}>{t}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <span>© 2026 Hands. Todos os direitos reservados.</span>
                    <span>Encontre quem resolve.</span>
                </div>
            </footer>
        </div>
    );
}