"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { NextPage } from "next";
import styles from "./home-page-component.module.css";
import {
  getHousingSearchProfiles,
  getCommunities,
  getOrganizerProfiles,
} from "../lib/utils/data";
import Link from "next/link";
import React from "react";
import { signInWithTwitter } from "../lib/utils/auth";
import { differenceInDays } from "date-fns";
import { BackgroundGradient } from "./ui/background-gradient";

type HomePageComponentProps = {
  referralDetails: ReferralDetails;
};

const HomePageComponent: NextPage<HomePageComponentProps> = ({
  referralDetails,
}) => {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [totalWeeklyProfiles, setTotalWeeklyProfiles] = useState(0);

  useEffect(() => {
    const fetchNumberOfUsers = async () => {
      let { data, error, count } = await supabase
        .from("users")
        .select("user_id", { count: "exact" });

      if (!error && data) {
        setNumberOfUsers(count ?? 0);
      }
    };

    fetchNumberOfUsers();
  }, []);

  useEffect(() => {
    const countThisWeekProfiles = (profiles: any) =>
      profiles.filter(
        (profile: any) =>
          differenceInDays(new Date(), new Date(profile.created_at || "")) < 30
      ).length;

    const fetchProfiles = async () => {
      const profilePromises = [
        getHousingSearchProfiles(),
        getOrganizerProfiles(),
        getCommunities(),
      ];
      const [searcherProfiles, organizerProfiles, communityProfiles] =
        await Promise.all(profilePromises);
      // const searcherProfiles = await getHousingSearchProfiles();
      // const organizerProfiles = await getOrganizerProfiles();
      // const communityProfiles = await getCommunities();
      const total =
        countThisWeekProfiles(searcherProfiles) +
        countThisWeekProfiles(organizerProfiles) +
        countThisWeekProfiles(communityProfiles);

      setTotalWeeklyProfiles(total);
    };

    fetchProfiles();
  }, []);

  const renderContent = () => {
    if (referralDetails?.status === "unclaimed") {
      return (
        <div className={styles.signInWithTwitterParent}>
          <Link
            className={styles.signInWithTwitter}
            href={`/?referralCode=${referralDetails.referralID}`}
            onClick={signInWithTwitter}
          >
            <div className={styles.vectorParent}>
              <img className={styles.vectorIcon} alt="" src="/vector.svg" />
              <div className={styles.signInWith}>Sign up with Twitter</div>
            </div>
          </Link>
          <div className={styles.vectorGroup}>
            <img className={styles.vectorIcon1} alt="" src="/vector1.svg" />
            <p className={styles.youHaveBeenContainer}>
              <span>{`You have been invited by `}</span>
              <span className={styles.maxKrieger}>
                {referralDetails.originatorName}
              </span>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {referralDetails?.status === "invalid" && (
            <p>Invalid referral code</p>
          )}
          <Link
            href="https://airtable.com/shrBmKG0e4fxr8hAp"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyWrapper}
          >
            <div className={styles.apply}>Apply</div>
          </Link>
          <Link
            href=""
            className={styles.signInSmall}
            onClick={signInWithTwitter}
          >
            Already have an account? Sign in
          </Link>
        </div>
      );
    }
  };

  return (
    // <section className={styles.frameParent}>

    // <section className="bg-grid-slate bg-fixed h-dvh flex flex-col justify-center items-center w-full">
    <div className="h-dvh w-full dark:bg-black bg-white bg-grid-blue-300/[0.2] relative flex flex-col items-center justify-center">
      <div className="z-[1] max-w-screen-md flex flex-col text-center justify-center items-center gap-6 p-4 ">
        <div className={styles.frameWrapper}>
          <div className={styles.ellipseParent}>
            <img
              className={styles.frameChild}
              alt=""
              src="/ellipse-51@3x.jpg"
            />
            <img className={styles.frameItem} alt="" src="/ellipse-50@3x.jpg" />
            <img
              className={styles.frameInner}
              alt=""
              src="/ellipse-52@3x.jpg"
            />
            <img
              className={styles.ellipseIcon}
              alt=""
              src="/ellipse-53@3x.jpg"
            />
          </div>
        </div>
        <h1 className={styles.findHousemates}>
          Find sublets, housemates, and coliving communities in the SF tech
          scene
        </h1>
        <p className={styles.thisIsAn}>
          The SF housing directory of people you probably know
        </p>
        {renderContent()}
        <BackgroundGradient className="flex rounded-[22px] max-w-md p-4 bg-white dark:bg-zinc-900">
          <div className={styles.generalWords}>
            <span className={styles.boldAndColored}>{numberOfUsers}</span>{" "}
            members of DirectorySF
          </div>
          <div className={styles.generalWords}>
            <span className={styles.boldAndColored}>{totalWeeklyProfiles}</span>{" "}
            listings posted this month 🔥
          </div>
        </BackgroundGradient>
      </div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
};

export default HomePageComponent;
