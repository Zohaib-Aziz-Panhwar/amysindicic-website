import { Link } from 'react-router-dom'
import { PageHero, SectionHead, Reveal } from '../components/ui'
import { LIBRARY } from '../data'
export default function Resources() {
  return (<main>
    <PageHero crumb="Free Resources" eyebrow="Free resources" title={<>The résumé library, samples and guides — <em>free.</em></>} lede="Crafted for professionals making the shift from federal to private-sector roles. This is the exact template Amy uses to help clients land interviews — and now it's yours." />
    <section className="section"><div className="wrap"><Reveal className="lead-magnet">
      <img src="assets/img/lib-resume-template-thumbnail.png" alt="Private-sector résumé template" />
      <div><span className="eyebrow">Free resume template for the private sector</span><h2>Built for federal-to-industry transitions</h2>
        <ul><li>Professionally designed to highlight transferable skills</li><li>ATS-friendly and easy to edit in Microsoft Word</li><li>Proven prompts to showcase your impact in plain, private-sector language</li></ul>
        <a className="btn btn--primary" href="assets/docs/Transformations-123-Resume-Template-.docx" download>Download the template (.docx)</a></div>
    </Reveal></div></section>
    <section className="section alt"><div className="wrap"><SectionHead eyebrow="Resumes library" title="Guides from Amy's library"><p className="lede">Short, practical PDFs on the parts of the transition that trip up senior leaders.</p></SectionHead>
      <div className="res-grid">{LIBRARY.map(([t, f, img, k], i) => <Reveal key={f} as="a" delay={i * .05} className="res" href={'assets/docs/' + f} download><img src={'assets/img/' + img} alt="" /><div><b>{t}</b><span>{k}</span></div></Reveal>)}</div></div></section>
    <section className="section" id="samples"><div className="wrap"><SectionHead eyebrow="Sample materials" title="See the standard before you commit"><p className="lede">These samples show the format, structure, branding and level of detail found in competitive executive and SES applications.</p></SectionHead>
      <div className="samples">
        <Reveal as="article" className="sample" id="executive"><img src="assets/img/exec-samples.webp" alt="Executive résumé samples" /><div className="sample__body"><h3>Free executive résumé samples</h3><p>Executive résumés developed for senior leaders pursuing leadership opportunities in the private sector, nonprofit organizations and government — demonstrating executive branding, career summaries, leadership accomplishments, quantifiable results and modern design.</p>
          <ul><li><a href="assets/docs/EXECUTIVE-RESUME-SAMPLE.pdf" download>Executive Résumé Sample #1</a></li><li><a href="assets/docs/EXAMPLE-EXECUTIVE-RESUME-2.pdf" download>Executive Résumé Sample #2</a></li></ul>
          <Link className="btn btn--ghost" to="/contact">Schedule a complimentary consultation</Link></div></Reveal>
        <Reveal as="article" className="sample" id="ses" delay={.1}><img src="assets/img/ses-samples.webp" alt="SES sample materials" /><div className="sample__body"><h3>Free SES sample materials</h3><p>Whether you're applying for your first SES position or refining an existing application, these samples show the format, structure and level of detail found in competitive SES packages: résumé, ECQs and TQs.</p>
          <ul><li><a href="assets/docs/SES-Resume-Sample-Alexandra-Chen.pdf" download>SES Résumé Sample</a></li><li><a href="assets/docs/SES-Sample-ECQ-Narratives-Alexandra-Chen.pdf" download>SES ECQ Narratives Sample</a></li><li><a href="assets/docs/SES-Sample-TQ-Narratives-Alexandra-Chen.pdf" download>SES TQ Narratives Sample</a></li></ul>
          <Link className="btn btn--ghost" to="/contact?program=ses">Ask about SES packages</Link></div></Reveal>
      </div></div></section>
  </main>)
}
