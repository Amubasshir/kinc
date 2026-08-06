import Image from "next/image";
import Link from "next/link";
import accent from "../../../../design/eyelash 5.png";
import mark from "../../../../design/Kin_Collage 4 (1).png";
export default function StartCommission(){return <section className="start-commission" aria-labelledby="start-commission-heading"><Image className="start-commission-mark" src={mark} alt="Kin"/><h2 id="start-commission-heading">Start your commission</h2><p>Create a beautiful statement piece for your home, or a deeply meaningful keepsake for grandparents.</p><div className="start-commission-action"><Link href="#commission-heading">GET STARTED</Link><Image src={accent} alt="" aria-hidden="true"/></div></section>}
