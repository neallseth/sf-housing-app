"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../components/home-page-component";
import { useState } from "react";
import { getReferralDetails } from "../lib/utils/data";
import { useRouter } from "next/navigation";
import {
  handleExistingUserSignIn,
  handleFirstUserSignin,
  handleSignIn,
} from "../lib/utils/process";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";
import { useAuthContext } from "@/contexts/auth-context";

const Home: NextPage = () => {
  const router = useRouter();
  const referralCode = useSearchParams().get("referralCode");
  const errorDescription = useSearchParams().get("error_description");
  const [referralDetails, setReferralDetails] = useState<ReferralDetails>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, userSession, authLoading } = useAuthContext();

  useEffect(() => {
    async function handlePageLoad() {
      // Check for error query parameter in URL
      if (errorDescription) {
        if (
          errorDescription === "Error getting user email from external provider"
        ) {
          alert(
            "You need to add your email address to your Twitter account. \n\nGo to Twitter -> More -> Settings and Support -> Your account -> Email. \n\nAfter you do this, try again."
          );
        } else {
          alert(
            "Error:\n" +
              errorDescription +
              "\n\nContact @thomasschulzz or @neallseth on Twitter to investigate."
          );
        }
      }

      if (referralCode) {
        const referral = await getReferralDetails(referralCode);
        if (referral.status === "unclaimed") {
          localStorage.setItem("referral-code", referralCode);
        } else {
          alert(`This referral is ${referral.status}`);
        }
        setReferralDetails(referral);
        return;
      }

      if (authLoading) {
        return;
      }

      if (userData) {
        setIsLoading(true);
        console.log("signin in existing user");
        const signinResult = await handleExistingUserSignIn(userData);
        if (signinResult.success) {
          setIsLoading(false);
          router.replace("/directory");
          return;
        }
      }

      if (userSession) {
        setIsLoading(true);

        // Attempt first sign-in
        const signinResult = await handleFirstUserSignin();
        if (signinResult.error) {
          console.error(signinResult.error);
          alert(signinResult.error);
        } else if (signinResult.success) {
          setIsLoading(false);

          router.replace("/directory");
          return;
        }
      }
      // else {
      //   setIsLoading(true);
      //   const signInResult = await handleSignIn();
      //   console.log(signInResult);
      //   setIsLoading(false);

      //   if (signInResult?.status !== "success") {
      //     if (signInResult?.status === "error") {
      //       alert(signInResult.message);
      //     }
      //     return;
      //   }
      //   router.replace("/directory");
      // }
    }
    handlePageLoad();
  }, [
    authLoading,
    errorDescription,
    referralCode,
    router,
    userData,
    userSession,
  ]);

  return (
    <div className={styles.home}>
      {isLoading && <LoadingSpinner />}
      <HomePageComponent referralDetails={referralDetails} />
    </div>
  );
};

export default Home;
