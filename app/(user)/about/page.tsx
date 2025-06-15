import AboutUsBanner from "@/components/AboutUs/AboutUsBanner";
import AboutUsIntro from "@/components/AboutUs/AboutUsIntro";
import Mission from "@/components/AboutUs/Mission";
import Container from "@/components/Container";

const AboutPage = () => {
  return (
    <Container className="max-w-6xl lg:px-8 py-12">
     <AboutUsBanner/>
     <AboutUsIntro/>
     <Mission/>
     {/* <Feather/>
     <Question/>
     <Commitment/> */}
    </Container>
  );
};

export default AboutPage;
