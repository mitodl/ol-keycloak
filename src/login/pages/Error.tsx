import type { PageProps } from "keycloakify/login/pages/PageProps"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { KcContext } from "../KcContext"
import type { I18n } from "../i18n"
import { Link, Paragraph, Alert } from "../components/Elements"
import { styled } from "@mui/material/styles"

const StyledAlert = styled(Alert)({
  marginBottom: "60px"
})

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { message, url } = kcContext

  const { msg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("errorTitle")}
    >
      <StyledAlert severity={message.type}>{kcSanitize(message.summary)}</StyledAlert>
      <Paragraph>
        {msg("pageExpiredMsg1")}{" "}
        <Link id="loginRestartLink" href={url.loginRestartFlowUrl}>
          {msg("doClickHere")}
        </Link>
      </Paragraph>
    </Template>
  )
}
