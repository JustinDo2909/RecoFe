"use client";
import CharityOverview from "@/components/Community/CharityOverview";
import CommunityBody from "@/components/Community/CommunityBody";
import CommunityIntro from "@/components/Community/CommunityIntro";
import Slogan from "@/components/Community/Slogan";
import Container from "@/components/Container";
import React, { useEffect, useState } from "react";

const CommunityPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Container>
      <CommunityIntro />
      <CommunityBody />
    

      <CharityOverview />
      <Slogan />
    </Container>
  );
};

export default CommunityPage;
