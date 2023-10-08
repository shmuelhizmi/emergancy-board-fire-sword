import Image from "next/image";
import styles from "./page.module.css";
import { Text, Card } from "@chakra-ui/react";
import { boards } from "./[id]/database";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <Text fontSize="2xl">מבצע חרבות ברזל - קיבוץ לוחות ולינקים חשובים</Text>
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
      </div>
    </main>
  );
}

// mac who is using port
// sudo lsof -i :3000
