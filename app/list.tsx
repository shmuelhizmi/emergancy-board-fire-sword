import styles from "./page.module.css";
import { Text, Card } from "@chakra-ui/react";
import Link from "next/link";

interface Props {
  items: {
    title: string;
    description: string;
    link: string;
    color: string;
    id: string;
  }[];
  title: string;
}

export default function List(props: Props) {
  return (
    <>
      <Text fontSize="2xl">{props.title}</Text>
      <div className={styles.grid}>
        {props.items.map((item) => {
          const isExternalLink = item.link.startsWith("http");
          const LinkEle = isExternalLink ? "a" : Link;
          const linkProps = isExternalLink
            ? { href: item.link, target: "_blank" }
            : { href: item.link };
          return (
            <LinkEle {...linkProps} key={item.id}>
              <Card className={styles.card} bg={item.color}>
                <Text fontSize="2xl">{item.title}</Text>
                <Text fontSize="md">{item.description}</Text>
              </Card>
            </LinkEle>
          );
        })}
      </div>
    </>
  );
}
