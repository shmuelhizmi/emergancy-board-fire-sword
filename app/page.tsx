import styles from "./page.module.css";
import List from "./list";
import { boards } from "./[id]/boards";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Text fontSize="2xl">מבצע חרבות ברזל - קיבוץ לוחות ולינקים חשובים</Text>
      <div className={styles.grid}>
        {boards.map((board) => {
          const isLink = board.type === "link";
          const LinkEle = isLink ? "a" : Link;
          const linkProps = isLink
            ? { href: board.url, target: "_blank" }
            : { href: `/${board.id}/` };
          return (
            <LinkEle {...linkProps} key={board.id}>
              <Card className={styles.card}>
                <Text fontSize="2xl">{board.title}</Text>
                <Text fontSize="md">{board.description}</Text>
              </Card>
            </LinkEle>
          );
        })}
      </div> */}
      <List
        items={boards.map((board) => ({
          color: "gray.200",
          id: board.id,
          link: board.type === "link" ? board.url : `/${board.id}/`,
          title: board.title,
          description: board.description,
        }))}
        title="מבצע חרבות ברזל - קיבוץ לוחות ולינקים חשובים"
      />
    </main>
  );
}
