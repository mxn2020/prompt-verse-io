import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Prompt Engineers Worldwide</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our users are saying about how Prompt-Verse has transformed their workflow.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <TestimonialCard 
            quote="Prompt-Verse has completely transformed how I create and manage prompts. The modular approach saves me hours every week."
            author="Alex Morgan"
            role="AI Content Strategist"
            avatarUrl="https://i.pravatar.cc/150?u=alex"
            initials="AM"
          />
          <TestimonialCard 
            quote="Our team's productivity skyrocketed after adopting Prompt-Verse. The collaboration features are unmatched in the industry."
            author="Samantha Lee"
            role="AI Research Team Lead"
            avatarUrl="https://i.pravatar.cc/150?u=samantha"
            initials="SL"
          />
          <TestimonialCard 
            quote="The structured approach to prompt engineering has helped us create consistent, high-quality prompts across our entire organization."
            author="David Chen"
            role="Product Manager"
            avatarUrl="https://i.pravatar.cc/150?u=david"
            initials="DC"
          />
          <TestimonialCard 
            quote="I love how easy it is to version and iterate on prompts. It's made A/B testing different approaches much more manageable."
            author="Rachel Kim"
            role="UX Researcher"
            avatarUrl="https://i.pravatar.cc/150?u=rachel"
            initials="RK"
          />
          <TestimonialCard 
            quote="The analytics dashboard gives me clear insights into which prompts are performing best with different AI models."
            author="James Wilson"
            role="Data Scientist"
            avatarUrl="https://i.pravatar.cc/150?u=james"
            initials="JW"
          />
          <TestimonialCard 
            quote="As an educator, I use Prompt-Verse to create tailored prompts for my students. It's been a game-changer for personalized learning."
            author="Maria Garcia"
            role="Education Technology Specialist"
            avatarUrl="https://i.pravatar.cc/150?u=maria"
            initials="MG"
          />
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
  initials: string;
}

function TestimonialCard({ quote, author, role, avatarUrl, initials }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <blockquote className="flex-1 mb-4">
          <p className="text-lg">&ldquo;{quote}&rdquo;</p>
        </blockquote>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={avatarUrl} alt={author} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}