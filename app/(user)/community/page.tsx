"use client";
import CharityCommunity from "@/components/Community/CharityCommunity";
import CharityOverview from "@/components/Community/CharityOverview";
import CommunityBody from "@/components/Community/CommunityBody";
import CommunityIntro from "@/components/Community/CommunityIntro";
import Slogan from "@/components/Community/Slogan";
import Container from "@/components/Container";
import React, { useEffect, useState } from "react";
import banner from "@/images/share3.jpg";

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
      <CharityCommunity
        charityList={[
          {
            image: banner,
            title: "Nhóm quyên góp quần áo cũ Tâm Đức",
            description:
              "Nhận quyên góp quần áo cũ, nhu yếu phẩm ủng hộ cho những người có hoàn cảnh khó khăn.",
            button: "Xem thêm",
          },
          {
            image: banner,
            title: "Nhóm quyên góp quần áo cũ Tâm Đức",
            description:
              "Nhận quyên góp quần áo cũ, nhu yếu phẩm ủng hộ cho những người có hoàn cảnh khó khăn.",
            button: "Xem thêm",
          },
          {
            image: banner,
            title: "Nhóm quyên góp quần áo cũ Tâm Đức",
            description:
              "Nhận quyên góp quần áo cũ, nhu yếu phẩm ủng hộ cho những người có hoàn cảnh khó khăn.",
            button: "Xem thêm",
          },
        ]}
      />

      <CharityOverview />
      <Slogan />
    </Container>
  );
};

export default CommunityPage;
