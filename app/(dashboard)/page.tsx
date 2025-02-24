import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';

export default async function HomePage() {
  return (
    <Tabs defaultValue="all">
      <Card>
        <CardHeader>
          <CardTitle>Home</CardTitle>
          <CardDescription>
            Welcome to the dashboard. Get started by selecting a page from the
            tabs below.
          </CardDescription>
        </CardHeader>
        <CardContent>Hey</CardContent>
      </Card>
    </Tabs>
  );
}
