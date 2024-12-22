export const message_handler = (message: string, action: string) => {
  return `<script type = "text/javascript">alert("${message}"); ${action}</script>`;
};

export const error_handler = (error: string) => {
  return `<script type = "text/javascript">alert("문제가 발생했습니다. 담당자에게 문의해주세요." ${error}); window.history.back();</script>`;
};
