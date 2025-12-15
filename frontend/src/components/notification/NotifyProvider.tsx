import React, { createContext, useContext } from "react";
import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

export type NotifyType = "success" | "warning" | "error" | "info" | "export";

interface NotifyOptions {
  message: string;
  description?: React.ReactNode;
  type?: NotifyType;
  placement?: NotificationPlacement;
  duration?: number | null;
}

type NotifyFn = (options: NotifyOptions) => void;

const iconMap: Record<NotifyType, React.ReactNode> = {
  success: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  warning: <WarningOutlined style={{ color: "#faad14" }} />,
  error: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
  info: <InfoCircleOutlined style={{ color: "#1677ff" }} />,
  export: <DownloadOutlined style={{ color: "#1677ff" }} />,
};

const NotifyContext = createContext<NotifyFn>(() => {});

export const useNotify = () => useContext(NotifyContext);

export const NotifyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const notify: NotifyFn = ({
    message,
    description,
    type = "info",
    placement = "bottomRight",
    duration = 4.5,
  }) => {
    notification.open({
      message,
      description,
      placement,
      duration: duration === null ? 0 : duration,
      icon: iconMap[type],
    });
  };

  return (
    <NotifyContext.Provider value={notify}>{children}</NotifyContext.Provider>
  );
};
