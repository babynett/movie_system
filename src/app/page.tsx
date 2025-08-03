import React from "react";
import Movies from "../components/main_components/Movies";
import SparkleTitle from "../components/designFont/SparkleTitle";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute>
      <>
        <SparkleTitle />
        <Movies />
      </>
    </ProtectedRoute>
  );
}

export default page;
