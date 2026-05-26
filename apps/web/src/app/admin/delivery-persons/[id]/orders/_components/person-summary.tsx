import { Badge } from "@zoltraak/ui/components/badge";
import { Card, CardContent } from "@zoltraak/ui/components/card";
import { Phone, Warehouse } from "lucide-react";
import { deliveryPersonStatusStyles } from "@/app/admin/delivery-persons/_components/columns";
import { cn } from "@/lib/utils";
import type { DeliveryPersonOrdersResponse } from "@/types";

type Person = DeliveryPersonOrdersResponse["person"];

export function PersonSummary({ person }: { person: Person }) {
  function formatted(phone: string) {
    const cleaned = phone.replace(/\D/g, "");
    const formatted =
      cleaned.length === 12
        ? `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
        : phone;
    return formatted;
  }

  return (
    <Card>
      <CardContent>
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="pb-1 font-semibold text-lg leading-none">
                {person.name}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 text-muted-foreground text-sm">
                <div className="flex items-center gap-x-1.5">
                  <Phone className="size-4" />
                  <span>{formatted(person.phone)}</span>
                </div>

                <div className="flex items-center gap-x-1.5">
                  <Warehouse className="size-4" />
                  <span>{person.warehouse.name}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Status
              </p>

              <Badge
                variant="outline"
                className={cn(
                  "mt-0.5 font-mono uppercase",
                  deliveryPersonStatusStyles[person.status],
                )}
              >
                {person.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
