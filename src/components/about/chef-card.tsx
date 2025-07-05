import Image from "next/image";
import { type Chef } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChefCardProps {
  chef: Chef;
}

export default function ChefCard({ chef }: ChefCardProps) {
  return (
    <Card className="text-center">
      <CardHeader className="p-0">
        <Image
          src={chef.imageUrl}
          alt={`Photo of ${chef.name}`}
          width={400}
          height={500}
          className="object-cover w-full h-80 rounded-t-lg"
          data-ai-hint="portrait chef"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="font-headline text-2xl">{chef.name}</CardTitle>
        <p className="text-primary font-semibold mb-2">{chef.title}</p>
        <CardDescription>{chef.bio}</CardDescription>
      </CardContent>
    </Card>
  );
}
