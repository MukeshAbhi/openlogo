import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import { VERIFICATION } from "../../utils/Constants";
import styles from "./Verification.module.css";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasVerified = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState(VERIFICATION.title);
  const [message, setMessage] = useState(VERIFICATION.message);
  const [data, setData ] = useState("");
  const [success, setSuccess] = useState(false)

  const { fetchRequest, errorMsg } = useApi({
    method: "get",
    url: `/auth/verify/${token}`,
  });

  const performVerification = useCallback(async () => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    const {data: response, success,} = await fetchRequest();
    setData(response);
    setSuccess(success)
    console.log("data :" , response)
  }, [token, fetchRequest]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  useEffect(() => {
    if(success) {
      if (!data.source) {
        console.log(data);
        
        setIsLoading(false);
        setTitle("Verified");
        setMessage(data?.message);
        setTimeout(() => navigate("/"), 6000);
      } else if (data.statusCode == 201) {
        console.log(data);
        setIsLoading(false);
        setTitle("Not yet Veified");
        setMessage(data?.message);
        setTimeout(() => navigate("/"), 3000);
      } 
    }
  }, [data, navigate]);

  useEffect(() => {
    if (errorMsg) {
      setIsLoading(false);
      setTitle("Error");
      setMessage(errorMsg);
      console.log("errorMsg : ", errorMsg);
      
    }
  }, [errorMsg]);

  return (
    <div className={styles.verificationPageContainer}>
      <div className={styles.verificationCard}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size={40} border={4} color="var(--primary)" />
          </div>
        )}
        <h2 className={styles.verifyTitle}>{title}</h2>
        <p className={styles.verifyMessage}>{message}</p>
      </div>
    </div>
  );
};

export default Verification;
