import emailSpellChecker from "@zootools/email-spell-checker"

/* Users logging in with MIT email addresses should be directed to Touchstone.
 * On the login screen, emails that closely match are shown a suggestion for typo corrections.
 * On the registration screen, users attempting to register with MIT email addresses are shown a message to return to login.
 */
export const ORG_EMAIL_DOMAINS = [
  // https://github.com/mitodl/ol-infrastructure/blob/a0d3000743e198c6a8c91d5a8c87d64de553e15e/src/ol_infrastructure/substructure/keycloak/olapps.py#L672-L688
  "mit.edu",
  "broad.mit.edu",
  "cag.csail.mit.edu",
  "csail.mit.edu",
  "education.mit.edu",
  "ll.mit.edu",
  "math.mit.edu",
  "med.mit.edu",
  "media.mit.edu",
  "mitimco.mit.edu",
  "mtl.mit.edu",
  "professional.mit.edu",
  "sloan.mit.edu",
  "smart.mit.edu",
  "solve.mit.edu",
  "wi.mit.edu"
]

export const EMAIL_SUGGESTION_DOMAINS = [
  ...ORG_EMAIL_DOMAINS,
  ...emailSpellChecker.POPULAR_DOMAINS,
  // Adding common email providers to the suggestion list. The email-spell-checker lists these as second-level domains,
  // but adding them here prevents them being suggested as they are being typed correctly.
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "hotmail.co.uk",
  "hotmail.fr",
  "msn.com",
  "icloud.com"
]

export const EMAIL_SPELLCHECKER_CONFIG = {
  domains: EMAIL_SUGGESTION_DOMAINS,
  // Empty the TLD list to avoid false positives for domains we can't reliably suggest for.
  topLevelDomains: []
}
