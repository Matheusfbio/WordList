import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        borderRightColor: "green",
        borderLeftWidth: 5,
        borderRightWidth: 5,
        height: 50,
        width: "95%",
        backgroundColor: "#e6ffe6",
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "green",
      }}
      text2Style={{
        fontSize: 16,
        color: "black",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        borderRightColor: "red",
        borderLeftWidth: 5,
        borderRightWidth: 5,
        height: 50,
        width: "95%",
        backgroundColor: "#ffe6e6",
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "red",
      }}
      text2Style={{
        fontSize: 16,
        color: "black",
      }}
    />
  ),
};
