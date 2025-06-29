import React, { useCallback, useContext } from "react";
import { RouteComponentProps } from "react-router";

import PATHS from "router/paths";
import labelsAPI from "services/entities/labels";
import { AppContext } from "context/app";
import { NotificationContext } from "context/notification";
import { getPathWithQueryParams } from "utilities/url";
import { IApiError } from "interfaces/errors";
import { API_ALL_TEAMS_ID, APP_CONTEXT_ALL_TEAMS_ID } from "interfaces/team";

import ManualLabelForm from "pages/labels/components/ManualLabelForm";
import { IManualLabelFormData } from "pages/labels/components/ManualLabelForm/ManualLabelForm";

const baseClass = "manual-label";

export const DUPLICATE_ENTRY_ERROR =
  "Couldn't add. A label with this name already exists.";

type IManualLabelProps = RouteComponentProps<never, never>;

const ManualLabel = ({ router }: IManualLabelProps) => {
  const { currentTeam } = useContext(AppContext);
  const { renderFlash } = useContext(NotificationContext);

  const onSaveNewLabel = useCallback(
    (formData: IManualLabelFormData) => {
      labelsAPI
        .create(formData)
        .then((res) => {
          router.push(
            getPathWithQueryParams(PATHS.MANAGE_HOSTS_LABEL(res.label.id), {
              team_id:
                currentTeam?.id === APP_CONTEXT_ALL_TEAMS_ID
                  ? API_ALL_TEAMS_ID
                  : currentTeam?.id,
            })
          );
          renderFlash("success", "Label added successfully.");
        })
        .catch((error: { data: IApiError }) => {
          renderFlash(
            "error",
            error.data.errors[0].reason.includes("Duplicate entry")
              ? DUPLICATE_ENTRY_ERROR
              : "Couldn't add label. Please try again."
          );
        });
    },
    [renderFlash, router]
  );

  const onCancelLabel = () => {
    router.goBack();
  };

  return (
    <div className={baseClass}>
      <ManualLabelForm onSave={onSaveNewLabel} onCancel={onCancelLabel} />
    </div>
  );
};

export default ManualLabel;
