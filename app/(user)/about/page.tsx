import AboutUsBanner from "@/components/AboutUs/AboutUsBanner";
import AboutUsIntro from "@/components/AboutUs/AboutUsIntro";
import Commitment from "@/components/AboutUs/Commitment";
import Feather from "@/components/AboutUs/Feather";
import Mission from "@/components/AboutUs/Mission";
import Question from "@/components/AboutUs/Question";
import Container from "@/components/Container";
import React from "react";

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
