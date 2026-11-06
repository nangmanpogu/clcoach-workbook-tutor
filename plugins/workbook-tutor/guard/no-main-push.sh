#!/bin/sh
# 클코가 main 에 바로 올리지 못하게 막는다. 기능은 브랜치를 만들어 PR 로 올린다.
# Claude Code 가 Bash 명령 전에 부른다(.claude/settings.json 의 PreToolUse). 막으면 끝 코드 2 와 함께 까닭을 알린다.
input=$(cat)
cmd=$(printf '%s' "$input" | tr '\n' ' ' | sed -nE 's/.*"command"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)".*/\1/p')
printf '%s' "$cmd" | grep -qE 'git( -C [^ ]+)* push' || exit 0
# push 뒤의 말에서 옵션을 빼면 원격과 올릴 곳이 남는다
rest=$(printf '%s' "$cmd" | sed -E 's/.*git( -C [^ ]+)* push//; s/[;&|].*//')
spec=$(printf '%s\n' $rest | grep -v '^-' | sed -n '2,$p')
block() {
  echo 'main 에는 바로 올리지 않아요. 브랜치를 만들어 PR 로 올려 주세요.' >&2
  exit 2
}
for s in $spec; do
  case ${s#+} in
    main | *:main | refs/heads/main | *:refs/heads/main) block ;;
  esac
done
# 올릴 곳을 적지 않았거나 HEAD 면 지금 브랜치가 올라간다. 같은 명령 안에서 새 브랜치로 옮기면 막지 않는다
case $spec in
  '' | HEAD) ;;
  *) exit 0 ;;
esac
printf '%s' "$cmd" | grep -qE 'git( -C [^ ]+)* (checkout -[bB]|switch -[cC])' && exit 0
dir=$(printf '%s' "$input" | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
[ "$(git -C "${dir:-.}" branch --show-current 2>/dev/null)" = main ] && block
exit 0
